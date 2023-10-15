Feature: Canvas
  Scenario: Load an empty canvas page
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
