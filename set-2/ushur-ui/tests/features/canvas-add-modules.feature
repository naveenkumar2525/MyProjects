Feature: Canvas add modules
  Scenario: Add modules
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    Then The number of "Message" modules should be "3"
    Then We see a step named "Send IA"
    When The inspector is opened for the "Send IA" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    Then The number of "Message" modules should be "2"
    Then We see a step named "Create New"
    When The inspector is opened for the "Create New" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    Then The number of "Message" modules should be "2"
    Then We see a step named "Main Menu"
    When The inspector is opened for the "Main Menu" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    Then The number of "Message" modules should be "2"
    Then We see a step named "Thank you"
    When The inspector is opened for the "Thank you" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    Then The number of "Message" modules should be "2"