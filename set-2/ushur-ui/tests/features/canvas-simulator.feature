Feature: Simulator
  Scenario: View Simulator
    Given Go to the main site
    When Change page to "Canvas"
    Then I see the button named Test Workflow
    Then I click on Test Workflow
    Then I choose my favourite city
    Then I enter my favourite sport
    Then I click on maximise workflow process
    Then I click on minimise workflow process
    Then I finish my simulation session