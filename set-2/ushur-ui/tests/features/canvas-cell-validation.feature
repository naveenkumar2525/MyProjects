Feature: Canvas cell validation
  Scenario: Check all cases creating invalidate links
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When I drag outport of "Welcome" step and drop it to blank area
    Then I don't see a link created from it
    When I drag outport of "Welcome" step and drop it to inport of itself
    Then I don't see a link created from it