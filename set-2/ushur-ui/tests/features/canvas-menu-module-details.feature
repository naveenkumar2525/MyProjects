Feature: Menu Module Details
  Scenario: View Menu Module Details
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    When I Drag and Drop the "Menu" module
    Then Select "Menu" module
    Then I will see the field label "Menu Heading"
    Then I will see the section for Menu Options
    Then I will see the section for Branch To
    Then I will see the section for Save User Selection
    Then I will see the section for Error Limit