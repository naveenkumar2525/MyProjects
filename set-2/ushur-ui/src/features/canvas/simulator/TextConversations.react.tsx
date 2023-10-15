import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleArrowUp } from "@fortawesome/pro-solid-svg-icons";

import { BotUI, BotUIAction, BotUIMessageList } from "@botui/react";
import "./UshurBotUI.theme.scss";
import { createBot } from "botui";
import {
  workflowDetails,
  initUshurResult,
  continueUshurResult,
  setInitUshurResponse,
  setContinueUshurResponse,
} from "../data/canvasSlice";
import {
  initUshurAsync,
  continueUshurAsync,
} from "../data/canvasAsyncRequests";
import { AccumulatedData } from "../../../api";
import SimulatorLoader from "../../../components/SimulatorLoader.react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const ushurBot = createBot();
enum EngagementStatus {
  OnGoing = "ONGOING",
  Ended = "ENDED",
}
interface BotUIResponse {
  value?: string;
  text?: string;
}
interface ActionProps {
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  actionIconClass: string;
}
const clearAllMessages = () => ushurBot.message.removeAll();
const notifyUser = async (content: string) => {
  const formattedContent = content.replace(
    /(https?:\/\/[^\s]+)/g,
    "<a href='$1' target='_blank'>$1</a>"
  );
  await ushurBot.message.add({
    delay: 500,
    type: "html",
    text: formattedContent,
    cssClass: "customFont",
  });
};
const notifyEnd = async (content: string) => {
  await ushurBot.message.add({
    delay: 500,
    type: "text",
    content,
    cssClass: "customFont, engagementEndStyle",
  });
};
let continueUshur = async (_response: string, _sid: string) => {};

const displayModules = async (
  data: AccumulatedData[],
  actionProps: ActionProps
) => {
  if (!data) return;
  let sid = "";
  if (data && data.length > 0 && data[0] && data[0].sid) sid = data[0].sid;
  const { onChange } = actionProps;
  await Promise.all(
    data.map(async (d: AccumulatedData) => {
      const promptText = d?.promptText || "";
      switch (d.engagementStatus) {
        case EngagementStatus.OnGoing: {
          await notifyUser(promptText);
          break;
        }
        case EngagementStatus.Ended: {
          await notifyEnd("The engagement has ended in this channel");
          break;
        }

        default: {
          let result: BotUIResponse = {};
          await notifyUser(promptText);
          result = (await ushurBot.action.set(
            {
              delay: 500,
              size: 30,
              placeholder: "Type here",
              cssClass: "customFont",
            },
            {
              actionType: "input",
              onChange: { onChange },
              confirmButtonText: (
                <FontAwesomeIcon
                  className={actionProps.actionIconClass}
                  icon={faCircleArrowUp as IconProp}
                />
              ),
            }
          )) as BotUIResponse;
          const resultValue = result?.value || "";
          await continueUshur(resultValue, sid);
        }
      }
    })
  );
};
const TextConversations = () => {
  const ushurId = useAppSelector(workflowDetails)?.id || "wappTest";
  const dispatch = useAppDispatch();
  const initWorkflowResult = useAppSelector(initUshurResult);
  const continueWorkflowResult = useAppSelector(continueUshurResult);
  const [loading, setLoading] = useState(true);
  const [actionIconClass, setActionIconClass] = useState("arrowUpGrey");
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const actionClass =
      event.currentTarget.value === "" ? "arrowUpGrey" : "arrowUpBlue";
    setActionIconClass(actionClass);
  };
  const actionProps: ActionProps = {
    actionIconClass,
    onChange: handleChange,
  };
  continueUshur = async (response: string, sid: string) => {
    let responseValue: string | number = "";
    if (Number.isNaN(Number(response))) {
      // If number assign it as number else string
      responseValue = response;
    } else {
      responseValue = +response;
    }
    await dispatch(
      continueUshurAsync({
        response: responseValue,
        sid,
      })
    );
  };

  useEffect(() => {
    clearAllMessages()
      .then(() =>
        dispatch(
          initUshurAsync({
            ushurId,
            accumulateResponses: true,
            ignoreState: true,
            getVars: true,
          })
        )
      )
      .catch((_err) => {
        throw new Error(`Failed to initiate workflow`);
      });
    return () => {
      dispatch(setInitUshurResponse(null));
      dispatch(setContinueUshurResponse(null));
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (
        initWorkflowResult &&
        initWorkflowResult.accumulatedData &&
        initWorkflowResult?.accumulatedData?.length > 0
      ) {
        setLoading(false);
        await displayModules(initWorkflowResult.accumulatedData, actionProps);
      }
    };
    setTimeout(() => {
      fetchData()
        .then((_resp: void) => "resp")
        .catch((_err: void) => "err");
    }, 1000);
  }, [initWorkflowResult]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        continueWorkflowResult &&
        continueWorkflowResult.accumulatedData &&
        continueWorkflowResult?.accumulatedData?.length > 0
      ) {
        setLoading(false);
        await displayModules(
          continueWorkflowResult.accumulatedData,
          actionProps
        );
      }
    };
    setTimeout(() => {
      fetchData()
        .then((_resp: void) => "resp")
        .catch((_err: void) => "err");
    });
  }, [continueWorkflowResult]);
  return (
    <>
      {loading ? (
        <SimulatorLoader className="h-80" />
      ) : (
        <BotUI bot={ushurBot}>
          <BotUIMessageList />
          <BotUIAction />
        </BotUI>
      )}
    </>
  );
};

export default TextConversations;
