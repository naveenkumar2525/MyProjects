Feature: Canvas Message Module IALink
  Scenario: Click on Insert IA Link button
    Given Go to the main site
    When Change page to "Canvas"
    When The inspector is opened for the "Welcome" step
    When The configured "Message" module is opened
    When The More button is clicked
    Then We see a button with text "Insert IA Link" in the toolbar
    When Button with Insert IA Link is clicked
    Then The "Message" module contains the text "To continue, use this secure link"
    Then The "Message" module contains the text "SessionUrl"
    