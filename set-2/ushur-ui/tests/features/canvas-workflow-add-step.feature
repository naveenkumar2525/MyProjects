Feature: Canvas add a new step
  Scenario: Add a new step in current branch
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When I hover over line under "Welcome" step
    Then I see a button in middle of line under "Welcome" step
    When I click button in middle of line under "Welcome" step
    Then I will see a popup with three menus
    Then I see "In this branch" in popup
    Then clicking "In this branch" makes total steps count plus one
    Then I see a new step is created
  Scenario: Add a new step in new branch
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When I hover over line under "Welcome" step
    Then I see a button in middle of line under "Welcome" step
    When I click button in middle of line under "Welcome" step
    Then I will see a popup with three menus
    Then I see "On new branch" in popup
    Then clicking "On new branch" makes total steps count plus one
    Then I see a new step is created
  Scenario: Delete a branch
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When I hover over line under "Welcome" step
    Then I see a button in middle of line under "Welcome" step
    When I click button in middle of line under "Welcome" step
    Then I will see a popup with three menus
    Then I see "Delete branch" in popup
    Then clicking "Delete branch" makes total links count minus one