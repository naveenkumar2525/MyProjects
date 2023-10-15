Feature: Menu Options
  Scenario: View Menu Options
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    When I Drag and Drop the "Menu" module
    Then Select "Menu" module
    Then I will see the section for Menu Options
    Then I add a Menu Option
    Then I will see a new option with text "Next Menu Option"
    Then I will see a branch to dropdown
    Then Click on Add Menu Option again
    Then I will see the button with text add another option
