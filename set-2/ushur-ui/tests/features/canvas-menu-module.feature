Feature: Menu Module
  Scenario: View Menu Module
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    When I Drag and Drop the "Menu" module
    Then Select "Menu" module