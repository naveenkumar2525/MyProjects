Feature: Add Step Button UI for Childless Steps
  Scenario: Childless step
    Given Go to the main site
    When Change page to "Canvas"
    Then I will see a childless step, I will display a AddStep shape
    Then I will see a link from the Parent step to the AddStep shape
    Then I will not allow the link to be selected or deleted
  Scenario: Hover State
    Given Go to the main site
    When Change page to "Canvas"
    When I hover over the AddStep button
    Then the state of the button will change to a hover state
    Then I will display a tooltip centered under the button with the text "Add Step here"
  Scenario: Click Add Step shape
    Given Go to the main site
    When Change page to "Canvas"
    Then I know there are total "8" steps there
    When I click on the AddStep shape
    Then I know there are total "9" steps there
  