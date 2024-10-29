![NUS logo](nuslogo.png)

CS3219: Project Report

Group 20

| **No.** | **Full Name (as in EduRec)** | **Student Number** <br>**(Axxxx)** |
| ------- | ---------------------------- | ---------------------------------- |
| 1       |                              |                                    |
| 2       |                              |                                    |
| 3       |                              |                                    |
| 4       |                              |                                    |
| 5       |                              |                                    |

## Table of Contents

[Declaration](#declaration)

[Individual Contributions](#individual-contributions)

[Product Backlog – Requirements Specification](#project-scope-product-backlog)

[Functional Requirements (+ Fulfillment)](#functional-requirements--fulfillment)

[Non-Functional Requirements (+ Fulfillment)](#non-functional-requirements--fulfillment)

# Declaration

We, the undersigned, declare that:

1\. The work submitted as part of this project is our own and has been done in collaboration with the members of our group and no external parties.

2\. We have not used or copied any other person’s work without proper acknowledgment.

3\. Where we have consulted the work of others, we have cited the source in the text and included the appropriate references.

4\. We understand that plagiarism is a serious academic offense and may result in penalties, including failing the project or course.

1. We have read the [NUS plagiarism policy and the Usage of Generative AI](https://www.comp.nus.edu.sg/cug/plagiarism/).

**Group Member Signatures:**

| **Full Name (as in Edu Rec)** | Signature | Date |
| ----------------------------- | --------- | ---- |
|                               |           |      |
|                               |           |      |
|                               |           |      |
|                               |           |      |
|                               |           |      |

# Individual Contributions

| **No** | **Full Name (as in Edu Rec)** | **Contributions _(write point wise for different components). Extend the table as needed._** |
| ------ | ----------------------------- | -------------------------------------------------------------------------------------------- |
| 1      |                               |                                                                                              |
| 2      |                               |                                                                                              |
| 3      |                               |                                                                                              |
| 4      |                               |                                                                                              |
| 5      |                               |                                                                                              |

# Project scope (Product backlog)

## Functional Requirements (+ Fulfillment)

| FR                                                                                                                                              | Priority | Sprint | PR  |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | --- |
| **M1: User Service** - responsible for user profile management                                                                                  |          |        |     |
| **F1.1 User Authentication**                                                                                                                    |          |        |     |
| F1.1.1 The system should enable registration with a unique email and username with a valid password                                             | H        | 2      |     |
| F1.1.2 The system should display a clear error message if the email is valid or if there is any empty field during registration                 | H        | 2      |     |
| F1.1.3 The system should only enable user to log in to a registered account with the correct credentials (email and password)                   | H        | 2      |     |
| F1.1.4 The system should display a clear error message if the user credentials do not match                                                     | H        | 2      |     |
| F1.1.5 The system should display a clear error message if the email is invalid or if there is any empty field during login                      | H        | 2      |     |
| F1.1.6 The system should enable users to log out of their accounts                                                                              | H        | 2      |     |
| F1.1.7 The system should display a clear error message if the user tries to sign up with an existing email or username                          | H        | 2      |     |
| F1.1.8 The system should display a success message upon successful registration and redirect the user to the login page                         | H        | 2      |     |
| F1.1.9 The system should display a success message upon successful login and redirect the user to the dashboard                                 | H        | 2      |     |
| **F1.2 User Account Management**                                                                                                                |          |        |     |
| F1.2.1 The system should enable users to update their username and password                                                                     | M        | 2      |     |
| F1.2.2 The system should enable users to delete their accounts                                                                                  | L        | 2      |     |
| **M2: Matching Service** - responsible for matching users                                                                                       |          |        |     |
| **F2.1 Pre-matching**                                                                                                                           |          |        |     |
| F2.1.1 The system should enable users to select the question difficulty level and topic they want to attempt                                    | H        | 3      |     |
| F2.1.2 The system should enable users to join a queue with the selected difficulty level and topic for matching                                 | H        | 3      |     |
| **F2.2 Matching Process**                                                                                                                       |          |        |     |
| F2.2.1 The system should be able to match 2 users in the queue that selected the same question difficulty level and topic                       | H        | 3      |     |
| F2.2.2 The system should match the users in the same queue on a first-come-first-serve basis                                                    | H        | 3      |     |
| F2.2.3 The system should enable users to voluntarily exit the matching process before a match has been found                                    | H        | 3      |     |
| F2.2.4 The system should timeout and notify the user if a match is unable to be found in 30 seconds                                             | M        | 3      |     |
| **M3: Question Service** - responsible for managing a question repository indexed by difficulty level                                           |          |        |     |
| **F3.1 Question Management**                                                                                                                    |          |        |     |
| F3.1.1 The system should allow CRUD operations to maintain a list of questions with different difficulty levels and topics                      | H        | 1      |     |
| F3.1.2 The system should allow both admin and non-admin users to retrieve questions                                                             | H        | 1      |     |
| F3.1.3 The system should only allow admin users to create a question with all fields specified: title, desctiptions, topic and difficulty level | H        | 1      |     |
| F3.1.4 The system should only allow admin users to update a question with one or more fields: title, desctiptions, topic and difficulty level   | H        | 1      |     |
| F3.1.5 The system should only allow admin users to delete a question                                                                            | H        | 1      |     |
| F3.1.6 The system should enable users to select the topics and difficulty levels dynamically based on the existing questions                    | H        | 1      |     |
| F3.1.7 The system should display an error if a user attempts to create or update a question with an existing title                              | H        | 1      |     |
| **F3.2 Questions Retrieval**                                                                                                                    |          |        |     |
| F3.2.1 The system should be able to retrieve a list of all questions from database to display the question for users                            | H        | 4      |     |
| F3.2.2 The system should be able to retrieve a specific question based on the topic and difficulty level during session initiation              | H        | 4      |     |
| **M4: Collaboration Service** - provides the mechanism for real-time collaboration                                                              |          |        |     |
| **F4.1 Collaborative Space**                                                                                                                    |          |        |     |
| F4.1.1 The system should be able to display matched users in an isolated collaborative space with the provided question                         | H        | 4      |     |
| F4.1.2 The system should provide a concurrent coding editor where matched users can edit the same code together                                 | H        | 4      |     |
| F4.1.3 The system should update text changes on the editor of both users in real-time                                                           | H        | 4      |     |
| F4.1.4 The system should handle conflicted changes gracefully                                                                                   | H        | 4      |     |
| F4.1.5 The system should display the cursor of the other user in the collaborative space                                                        | L        | 4      |     |
| **F4.2 Session Management**                                                                                                                     |          |        |     |
| F4.2.1 The system should start a session immediately when a match is found                                                                      | H        | 4      |     |
| F4.2.2 The system should only allow the users who are matched in the current session to enter the collaborative space                           | M        | 4      |     |
| F4.2.3 The system should enable users to leave the collaborative session voluntarily                                                            | H        | 4      |     |
| F4.2.4 The system should display a message if the other user has left the session                                                               | H        | 4      |     |
| F4.2.5 The system should allow the user to re-enter the collaborative session if the other user has not left                                    | M        | 4      |     |
| F4.2.6 The system should end the session if both users have left                                                                                | M        | 4      |     |
| F4.2.7 The system should be able to detect inactivity from either matched users and terminate the session via a timeout appropriately           | L        | 4      |     |
| F4.2.8 The system should auto-save the code for easy rollbacks                                                                                  | L        | 4      |     |

## Non-Functional Requirements (+ Fulfillment)

| NFR                                                                                                                                                                         | Priority | Sprint | PR  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | --- |
| **NF1.1 Security**                                                                                                                                                          |          |        |     |
| NF1.1.1 User passwords must be appropriately stored and securely encrypted                                                                                                  | H        | 1      |     |
| NF1.1.2 The system must implement secure authentication, allowing only registered users to log in                                                                           | H        | 1      |     |
| NF1.1.3 User data, including registration details, match history, and any personal information, must be protected in transit and at rest using industry-standard encryption | H        | 1      |     |
| NF1.1.4 The system should enforce token based authentication using JWT with timeout to allow only authenticated users to access to the features                             | H        | 1      |     |
| **NF1.2 Performance**                                                                                                                                                       |          |        |     |
| NF1.2.1 Frontend actions that interact with the backend should have minimal delay (< 3 seconds)                                                                             | M        | 1      |     |
| NF1.2.2 The system should be able to match users within 30 seconds when there are sufficient users in the queue                                                             | H        | 4      |     |
| **NF1.3 Latency**                                                                                                                                                           |          |        |     |
| NF1.3.1 The system should have minimal delay in displaying real-time updates in the collaboration space (<200ms)                                                            | H        | 4      |     |
| **NF1.4 Cross browser compatibility**                                                                                                                                       |          |        |     |
| NF1.4.1 The system should support major browsers such as Google Chrome, Firefox, Safari, Microsoft, Edge                                                                    | H        | 4      |     |
| **NF1.5 Scalability**                                                                                                                                                       |          |        |     |
| NF1.5 The services should be deployed in containers using Docker for ease of management and scaling                                                                         | H        | 4      |     |

\* Expand the table as necessary

## Selected Nice-to-haves

Use similar table structure as above, or any other format.

- **N1 - Communication**:

  - Implement a mechanism to facilitate communication among the participants in the collaborative space.
  - Add in-session real-time text chat to enable matched users to communicate during collaboration.

- **N2 - History**:

  - Maintain a record of the questions attempted by the user, e.g., maintain a list of questions attempted along with the
    date-time of attempt, the attempt itself, and/or suggested solutions.
  - Possible information to log:
    - Question ID (to get details from the questions service; suggested solutions are also included),
    - Timestamps (e.g. start/end of session),
    - Snapshots (e.g. collaboration content history with its own timestamps).
  - History would be its own service, with a dedicated frontend page in **M5**.
  - Data would be periodically updated in history while the session is live and can later be retrieved as needed.

- **N3 - Code execution**:

  - Implement a mechanism to execute attempted solutions/code in a sandboxed environment and retrieve and present the
    results in the collaborative workspace.
    - Allow only one or two languages to be executed.

- **N4 - Enhanced collaboration**:

  - Enhance the collaboration service by providing an improved code editor with features such as code formatting, syntax
    highlighting for one language, and syntax highlighting for multiple languages.
  - The user will be able to choose the language they want to use.
  - Syntax highlighting will adjust according to the selected language. When switching languages, the code written in the
    previous language will be cleared.

- **N9 - API Gateway**:

  - The application should have an API gateway that redirects requests to the relevant microservices.
  - Example: Using an ingress controller such as NGINX ingress controller if using Kubernetes
    (https://kubernetes.GitHub.io/ingress-nginx/).
  - The application should route services accordingly (e.g., questions-related queries should go to the question
    microservice).
  - The application should balance the load of API requests across the backend services.

- **N7 - Deployment**:
  - Deploy the app on a production system (AWS/GCP cloud platform).
  - The application should be publicly accessible on the Internet.
  - Application data should be consistent and persisted in the production environment.

## Design

Follow the guidelines in the Project document Appendix 2

...

## Project plan

Follow the guidelines in the Project document Appendix 2

...

## &lt;Add any other relevant information about your project as new sections here&gt;

...
