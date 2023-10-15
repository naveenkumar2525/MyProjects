Feature: Canvas Menu
  Scenario: View Workflow menu button
    Given Go to the main site
    When Change page to "Canvas"
    Then I will see a button dropdown with a gear icon
  Scenario: Hover State & Tooltip
    Given Go to the main site
    When Change page to "Canvas"
    Then I will see a button dropdown with a gear icon
    When I hover over the gear button
    Then I will see "Workflow Menu" as the tooltip text
    When I move off of the gear button
    Then I will not see "Workflow Menu" as the tooltip text
  Scenario: Canvas Menu Items
    Given Go to the main site
    When Change page to "Canvas"
    When I click on the Workflow Menu button
    Then a dropdown menu will appear
    Then I will see the menu category text "Workflow Menu"
    Then I will see a divider line
    When I click on option "Edit"
    Then the menu will disappear
    When I click on the Workflow Menu button
    Then a dropdown menu will appear
    When I click on option "Clone"
    Then the menu will disappear
    When I click on the Workflow Menu button
    When I click on option "Versions"
    Then the menu will disappear
    When I click on the Workflow Menu button
    When I click on option "Language"
    Then the menu will disappear
    When I click on the Workflow Menu button
    When I click on option "Properties"
    Then the menu will disappear
    When I click on the Workflow Menu button
    When I click on option "Delete"
    Then the menu will disappear