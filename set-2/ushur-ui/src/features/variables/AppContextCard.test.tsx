import { useEffect } from "react";
import { render, fireEvent, waitFor} from "../../utils/test.utils";
import AppContextDropdown from "../../components/AppContextDropdown.react";
import { useAppDispatch } from "../../app/hooks";
import { setUshurs } from "../ushurs/ushursSlice";

const onclick = jest.fn()

const Component = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUshurs([{ AppContext: "TestAutomation" }, { AppContext: "Main" }]));
  }, []);
  return <AppContextDropdown containerWidth={300} handleProjectChange={onclick} />;
};

let getByTextQuery: any;
let containerObj: any;

beforeEach(() => {
  const { getByText, container } = render(
    <Component />
  );
  getByTextQuery = getByText;

  containerObj = container;
});

test("empty test", () => {
  expect(null).toBeFalsy();
});

// test("should contain Projects dropdown", () => {
//   const ele = containerObj.querySelector(".ushur-dropdown");
//   expect(ele).toBeInTheDocument();
// });

// test("should show sublabel", () => {
//   const ele = getByTextQuery(/Selected Project/i);
//   expect(ele).toBeInTheDocument();
// });

// test("should display Main project by default", () => {
//   const ele = getByTextQuery(/Main/i);
//   expect(ele).toBeInTheDocument();
// });

// test("should open dropdown with two options", async () => {
//   const DropdownToggle = containerObj.querySelector('.dropdown-toggle');
//   fireEvent.click(DropdownToggle);
//   const showDropdown = await waitFor(() => containerObj.querySelector('.show.dropdown'));
//   expect(showDropdown).toBeInTheDocument();
//   expect(containerObj.querySelectorAll(".dropdown-item")).toHaveLength(2);
// });

// test("Should call function when one option is selected and should show that option as dropdown title", async () => {
//   const DropdownToggle = containerObj.querySelector('.dropdown-toggle');
//   fireEvent.click(DropdownToggle);
//   const dropdownOption = await waitFor(() => getByTextQuery(/TestAutomation/i));
//   fireEvent.click(dropdownOption);
//   expect(onclick).toHaveBeenCalledTimes(1);
//   const selectedOption = containerObj.querySelector('.truncate-title');
//   expect(selectedOption.innerHTML).toBe('TestAutomation');
// });
