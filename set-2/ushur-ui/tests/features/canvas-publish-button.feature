Feature: Publish/Unpublish Workflow
  Scenario: View initial Unpublished button
    Given Go to the main site
    When Change page to "Canvas"
    Then I will see a button named "Unpublished"
    Then I will see a sleeping icon
  Scenario: Toggle Published/Unpublish
    Given Go to the main site
    When Change page to "Canvas"
    When I click the unpublished button
    Then the button icon will change to a circle check icon
    Then the button text will change to Published
    When I click the published button
    Then the button icon will change to a sleeping icon
    Then the button text will change to Unpublished