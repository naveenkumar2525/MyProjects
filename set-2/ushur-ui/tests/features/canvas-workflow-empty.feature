Feature: Empty Workflow
  Scenario: Create Welcome Step
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    Then The step has a description "This is your first step in the workflow."
    Then The step has a configured "Message" module
    When The configured "Message" module is opened
    Then The "Message" module has the text "Welcome to your workflow!"