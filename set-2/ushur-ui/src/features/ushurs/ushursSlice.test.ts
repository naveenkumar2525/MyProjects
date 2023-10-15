import ushurReducer, {
  updateProjectsSortState,
  groupWorkflowsByCampaign,
  UshursState,
} from "./ushursSlice";

const setupDefaultMultipleWorkflows = () => [
  {
    campaignId: "jill",
    templateId: null,
    lastEdited: "2022-05-09T17:26:09.791Z",
    author: "test_admin@ushurdummy.me",
    AppContext: "TestAutomation",
  },
  {
    campaignId: "jack",
    templateId: null,
    lastEdited: "2022-01-10T17:26:09.791Z",
    author: "test_admin@ushurdummy.me",
    AppContext: "Main",
  },
  {
    campaignId: "joe",
    templateId: null,
    lastEdited: "2022-07-19T17:26:09.791Z",
    author: "test_admin@ushurdummy.me",
    AppContext: "Staging",
  },
];

const setupNaturalSortMultipleWorkflows = () => [
  {
    campaignId: "jill",
    templateId: null,
    lastEdited: "2022-05-09T17:26:09.791Z",
    author: "test_admin@ushurdummy.me",
    AppContext: "1Workflow",
  },
  {
    campaignId: "jack",
    templateId: null,
    lastEdited: "2022-01-10T17:26:09.791Z",
    author: "test_admin@ushurdummy.me",
    AppContext: "2ndworkflow",
  },
  {
    campaignId: "joe",
    templateId: null,
    lastEdited: "2022-07-19T17:26:09.791Z",
    author: "test_admin@ushurdummy.me",
    AppContext: "10thworkflow",
  },
  {
    campaignId: "joe2",
    templateId: null,
    lastEdited: "2022-07-19T17:26:09.791Z",
    author: "test_admin@ushurdummy.me",
    AppContext: "22ndworkflow",
  },
];

describe("Ushur selectors", () => {
  test("grouping an empty workflow returns an empty grouping", async () => {
    const workflows: any[] = [];
    const projectSorting = "name_asc";
    const result = groupWorkflowsByCampaign(
      workflows,
      projectSorting
    );

    expect(result).toEqual([]);
  });

  test("grouping a single workflow returns a single grouping", async () => {
    const workflows: any[] = [
      {
        campaignId: "jil",
        templateId: null,
        lastEdited: "2022-05-09T17:26:09.791Z",
        author: "test_admin@ushurdummy.me",
        AppContext: "TestAutomation",
      },
    ];

    const projectSorting = "name_asc";
    const result = groupWorkflowsByCampaign(
      workflows,
      projectSorting
    );

    const expected = [
      {
        AppContext: "TestAutomation",
        faqs: [],
        recent: 1652117169791,
        workflows: [
          {
            AppContext: "TestAutomation",
            author: "test_admin@ushurdummy.me",
            campaignId: "jil",
            lastEdited: "2022-05-09T17:26:09.791Z",
            status: false,
            templateId: null,
          },
        ],
      },
    ];
    expect(result).toEqual(expected);
  });

  test("grouping a single workflow with an invalid date returns a single grouping with a date of 0", async () => {
    const workflows: any[] = [
      {
        campaignId: "jil",
        templateId: null,
        lastEdited: "a bad date",
        author: "test_admin@ushurdummy.me",
        AppContext: "TestAutomation",
      },
    ];

    const projectSorting = "name_asc";
    const result = groupWorkflowsByCampaign(
      workflows,
      projectSorting
    );

    const expected = [
      {
        AppContext: "TestAutomation",
        faqs: [],
        recent: 0,
        workflows: [
          {
            AppContext: "TestAutomation",
            author: "test_admin@ushurdummy.me",
            campaignId: "jil",
            lastEdited: "a bad date",
            status: false,
            templateId: null,
          },
        ],
      },
    ];
    expect(result).toEqual(expected);
  });

  test("grouping multiple workflows in ascending order returns a grouping in the proper order", async () => {
    const workflows = setupDefaultMultipleWorkflows();

    const projectSorting = "name_asc";
    const result = groupWorkflowsByCampaign(
      workflows,
      projectSorting
    );

    const expectedResult = [
      {
        AppContext: "Main",
        faqs: [],
        recent: 1641835569791,
        workflows: [
          {
            AppContext: "Main",
            author: "test_admin@ushurdummy.me",
            campaignId: "jack",
            lastEdited: "2022-01-10T17:26:09.791Z",
            status: false,
            templateId: null,
          },
        ],
      },
      {
        AppContext: "Staging",
        faqs: [],
        recent: 1658251569791,
        workflows: [
          {
            AppContext: "Staging",
            author: "test_admin@ushurdummy.me",
            campaignId: "joe",
            lastEdited: "2022-07-19T17:26:09.791Z",
            status: false,
            templateId: null,
          },
        ],
      },
      {
        AppContext: "TestAutomation",
        faqs: [],
        recent: 1652117169791,
        workflows: [
          {
            AppContext: "TestAutomation",
            author: "test_admin@ushurdummy.me",
            campaignId: "jill",
            lastEdited: "2022-05-09T17:26:09.791Z",
            status: false,
            templateId: null,
          },
        ],
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  test("grouping multiple workflows in descending order returns groupings in the proper order", async () => {
    const workflows = setupDefaultMultipleWorkflows();

    const projectSorting = "name_dsc";
    const result = groupWorkflowsByCampaign(
      workflows,
      projectSorting
    );

    const expectedResult = [
      {
        AppContext: "TestAutomation",
        faqs: [],
        recent: 1652117169791,
        workflows: [
          {
            AppContext: "TestAutomation",
            author: "test_admin@ushurdummy.me",
            campaignId: "jill",
            lastEdited: "2022-05-09T17:26:09.791Z",
            status: false,
            templateId: null,
          },
        ],
      },
      {
        AppContext: "Staging",
        faqs: [],
        recent: 1658251569791,
        workflows: [
          {
            AppContext: "Staging",
            author: "test_admin@ushurdummy.me",
            campaignId: "joe",
            lastEdited: "2022-07-19T17:26:09.791Z",
            status: false,
            templateId: null,
          },
        ],
      },
      {
        AppContext: "Main",
        faqs: [],
        recent: 1641835569791,
        workflows: [
          {
            AppContext: "Main",
            author: "test_admin@ushurdummy.me",
            campaignId: "jack",
            lastEdited: "2022-01-10T17:26:09.791Z",
            status: false,
            templateId: null,
          },
        ],
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  test("grouping multiple workflows in recent ordering returns groupings in the proper order", async () => {
    const workflows = setupDefaultMultipleWorkflows();
    const projectSorting = "";
    const result = groupWorkflowsByCampaign(
      workflows,
      projectSorting
    );

    const expectedResult = [
      {
        AppContext: "Staging",

        workflows: [
          {
            campaignId: "joe",
            templateId: null,
            lastEdited: "2022-07-19T17:26:09.791Z",
            author: "test_admin@ushurdummy.me",
            AppContext: "Staging",
            status: false,
          },
        ],
        recent: 1658251569791,
        faqs: [],
      },
      {
        AppContext: "TestAutomation",
        workflows: [
          {
            campaignId: "jill",
            templateId: null,
            lastEdited: "2022-05-09T17:26:09.791Z",
            author: "test_admin@ushurdummy.me",
            AppContext: "TestAutomation",
            status: false,
          },
        ],
        recent: 1652117169791,
        faqs: [],
      },
      {
        AppContext: "Main",
        workflows: [
          {
            campaignId: "jack",
            templateId: null,
            lastEdited: "2022-01-10T17:26:09.791Z",
            author: "test_admin@ushurdummy.me",
            AppContext: "Main",
            status: false,
          },
        ],
        recent: 1641835569791,
        faqs: [],
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  /* Disable test until algorithm developed for natural sorting */
  xtest("grouping multiple workflows in ascending natural ordering returns groupings in the proper order", async () => {
    const workflows = setupNaturalSortMultipleWorkflows();
    const projectSorting = "";
    const result = groupWorkflowsByCampaign(
      workflows,
      projectSorting
    );

    const expectedResult = [
      {
        AppContext: "IL0 Foo",
        workflows: [
          {
            campaignId: "joe",
            templateId: null,
            lastEdited: "2022-07-19T17:26:09.791Z",
            author: "test_admin@ushurdummy.me",
            AppContext: "IL0 Foo",
            status: false,
          },
        ],
        recent: 1658251569791,
        faqs: [],
      },
      {
        AppContext: "IL10 Baz",
        workflows: [
          {
            campaignId: "jill",
            templateId: null,
            lastEdited: "2022-05-09T17:26:09.791Z",
            author: "test_admin@ushurdummy.me",
            AppContext: "IL10 Baz",
            status: false,
          },
        ],
        recent: 1652117169791,
        faqs: [],
      },
      {
        AppContext: "PI0 Bar",
        workflows: [
          {
            campaignId: "jack",
            templateId: null,
            lastEdited: "2022-01-10T17:26:09.791Z",
            author: "test_admin@ushurdummy.me",
            AppContext: "PI0 Bar",
            status: false,
          },
        ],
        recent: 1641835569791,
        faqs: [],
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});

describe("Ushur reducers", () => {
  const state: UshursState = {
    list: setupDefaultMultipleWorkflows(),
    status: "idle",
    projectsSortState: "name_dsc",
    activeProjectMenu: "",
    initiatedActivitiesDetails:{},
    totalActivitiesCount: 0,
    activitySummary: [],
    activitySummaryStatus: "",
    currentLastRecordId: '',
    previousLastRecordId: '',
    initiatedActivitiesStats: {},
    ushurJSON: [],
    ushurDetails: {}
  };

  test("should handle initial state", () => {
    const initialState = state;
    const action = { type: "unknown" };
    const expectedState = initialState;

    expect(ushurReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle updateProjectsSortState for an empty payload ", () => {
    const initialState = { ...state };
    const action = updateProjectsSortState(undefined);
    const expectedState = { ...state, projectsSortState: "recent" };

    expect(ushurReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle updateProjectsSortState for a given project state", () => {
    const initialState = { ...state };
    const action = updateProjectsSortState("loading");
    const expectedState = { ...state, projectsSortState: "loading" };

    expect(ushurReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle updateProjectsSortState for an empty project state", () => {
    const initialState = { ...state };
    const action = updateProjectsSortState(undefined);
    const expectedState = { ...state, projectsSortState: "recent" };

    expect(ushurReducer(initialState, action)).toEqual(expectedState);
  });
});
