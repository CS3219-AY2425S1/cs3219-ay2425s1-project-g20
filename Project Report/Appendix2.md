## Appendix 2 – Technical documentation requirements/guidelines

This appendix outlines the requirements and guidelines for preparing the technical
report/documentation of PeerPrep. The following guidelines cover areas such as architecture design,
deployment strategies, internal microservice details, project planning, and individual contributions.
These guidelines will help in creating clear and well-structured documentation that reflects the
collective work and technical decisions made by the team.

### Preliminaries

- The cover page should be followed by a table of contents. (Use the template provided)
- The report must begin with a signed declaration form by all team members (see Appendix 3).
- Clearly outline each team member's role in designing and developing the
  microservice(s)/components involved in PeerPrep. (Note: Everyone is expected to contribute
  roughly equally to documentation and team tasks.)
  - Ensure the contributions are presented in a tabular format that clearly shows the
    distribution of work.
    Scope of the project
- Define the scope of the project by recording the functional and non-functional requirements
  (FRs and NFRs) using a backlog.
- You may choose to include the microservice template (shown in Lecture 3) that outlines the
  scope. (You can use the Milestone 1 deliverable here!)

### Design: Architecture

- Include an architecture/component design section focusing on the product architecture
  and/or microservice deployment. The diagrams must be labeled or annotated and
  accompanied by brief descriptions of each component's purpose and structure.
- You can describe the components and integrations involved in your deployment. For example,
  you can describe key external integrations like authentication services, databases, etc.; CI/CD
  pipeline; specific mechanisms for frontend-backend communication (e.g., API gateway,
  service registry, etc.). Note that this is neither exhaustive nor a checklist of things to be done
  in the project.
- You can describe the choice of tech stack in general or specific to individual microservices.
- Describe the matching algorithm, choice and mechanism used for collaboration, and specific
  design choices in managing the questions.
- Explain how your design, development, and/or deployment choices impact the NFR you are
  targeting.
- Nice-to-haves
  o Similar details as above are expected for each of the selected/implemented nice-to-
  haves.

### Design: Internal microservice design

- Document the internal design of at least two microservices.
- Include labeled/annotated design diagram(s) and brief descriptions.
  Project plan
- Present a project plan using a Gantt chart or equivalent, organizing tasks based on technical
  milestones. For example, developing, integrating, and deploying a microservice in the project
  timeline.
