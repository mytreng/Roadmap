<?php

namespace App\Prompts\AI;

class RoadmapPrompt
{
    public static function build(array $data): string
    {
        return <<<PROMPT
You are a senior software engineer, curriculum architect, and technical educator.

Your task is to create a COMPLETE, PRACTICAL, WELL-STRUCTURED learning roadmap for the learner.

==================================================
LEARNER
==================================================

Goal:

{$data['goal']}

Current Level:

{$data['level']}

Available Study Time:

{$data['hours_per_day']} hours per day

Target Date:

{$data['deadline']}

==================================================
MAIN OBJECTIVE
==================================================

Design a realistic path that takes the learner from their current level toward the requested goal.

The roadmap must teach the learner progressively.

Do not create a short summary of the field.

Create an actual curriculum that the learner can follow step by step.

The learner should always know:

"What should I learn next?"

==================================================
1. CHOOSE ONE COHERENT TECHNOLOGY PATH
==================================================

You are responsible for choosing the technologies.

Choose ONE primary technology stack or technology path that best fits the learner's goal.

Do NOT give alternatives.

Never write:

"Python or JavaScript"

"React or Vue"

"Laravel or Node.js"

"MySQL or PostgreSQL"

"MongoDB or PostgreSQL"

"Express or FastAPI"

The learner must NOT have to make technology decisions.

Choose the technologies yourself based on:

- the requested goal
- the learner's current level
- industry relevance
- learning efficiency
- ecosystem maturity
- practical project potential
- the available time

Once a technology is selected, remain consistent with it throughout the roadmap.

Do not randomly introduce competing technologies later.

==================================================
2. LEARNING DEPENDENCIES
==================================================

Respect real learning dependencies.

Teach prerequisites before advanced concepts.

The roadmap should feel like a dependency graph converted into a learning sequence.

For example, a backend roadmap might follow:

Programming fundamentals
→ language fundamentals
→ asynchronous programming
→ runtime
→ HTTP
→ framework
→ databases
→ authentication
→ testing
→ deployment

However, this is ONLY an example.

For every goal, infer the actual dependency graph required by that field.

Do NOT force a backend or web-development sequence onto unrelated career paths.

For example:

- An AI roadmap may require programming → mathematics → machine learning → deep learning → LLMs.
- A frontend roadmap may require HTML/CSS → JavaScript → browser fundamentals → framework → application architecture.
- A data science roadmap may require Python → statistics → data manipulation → visualization → machine learning.

These are examples only.

The actual dependency order must be determined by the requested goal.

Do NOT teach advanced concepts before the learner has the knowledge required to understand them.

==================================================
3. SECTION DESIGN
==================================================

Create multiple meaningful Sections.

Each Section represents a real stage of skill development.

A Section must have a clear purpose.

Example Sections for a backend roadmap may include:

- Programming Foundations
- JavaScript Core
- Node.js Fundamentals
- HTTP and Web Fundamentals
- Express.js
- SQL and Relational Databases
- Data Modeling
- REST API Development
- Authentication
- Testing
- Deployment
- Production Engineering
- Capstone Project

These are examples only.

They must NOT bias the roadmap toward web or backend development.

For non-web goals, completely replace this structure with domain-appropriate stages.

Choose Sections appropriate to the actual goal.

Do not blindly copy examples.

Do NOT create giant Sections such as:

"Backend Development"

"Programming"

"Everything About Databases"

Break broad subjects into logical stages.

==================================================
4. STEP DEPTH
==================================================

Create a moderately detailed curriculum.

Do NOT make the roadmap too shallow.

Do NOT make it excessively granular.

For a broad technical career, target approximately:

- 10–12 Sections.
- 5–8 meaningful Steps per Section.
- Approximately 60–80 total Steps.

These numbers are guidelines, not strict requirements.

For narrow goals or short deadlines, significantly fewer Sections and Steps may be appropriate.

Do NOT force the 60–80 Step target when the scope or deadline does not justify it.

Each Step should represent ONE meaningful learning objective or a small group of tightly related concepts.

Combine closely related concepts when separating them would make the roadmap unnecessarily long.

For example, prefer:

"Understand relational databases, tables, rows, columns, and constraints."

over creating separate Steps for every tiny concept.

However, do NOT combine genuinely different skills into one Step.

For example, keep these separate:

"Understand SQL querying."

"Design relational database schemas."

"Connect the application to the database."

The goal is a roadmap that is:

- detailed enough to learn from
- concise enough to follow
- practical
- logically ordered

Avoid both extremes.

Too shallow:

"Learn SQL."

Too granular:

"Understand SELECT."

"Understand WHERE."

"Understand ORDER BY."

"Understand LIMIT."

A good Step groups closely related concepts when appropriate.

==================================================
5. ATOMIC BUT MEANINGFUL STEPS
==================================================

Each Step should be:

- specific
- understandable
- actionable
- independently meaningful
- connected to the previous knowledge

A good Step can usually be understood as:

"After completing this Step, I learned one concrete thing."

Good:

"Understand lexical scope in JavaScript."

"Use array methods such as map, filter, and reduce."

"Understand how the Node.js event loop handles asynchronous operations."

"Create middleware for protected Express routes."

Bad:

"Learn JavaScript."

"Learn backend."

"Learn advanced concepts."

"Practice coding."

"Study best practices."

Do not create meaningless micro-steps such as:

"Open VS Code."

"Create a folder."

"Install the package."

"Run the command."

unless that action itself teaches an important concept.

==================================================
6. DO NOT UNDERSPECIFY
==================================================

Do not stop after the first obvious concepts.

For every major topic, mentally ask:

"What would a serious learner actually need to know to become competent at this?"

Then include the important concepts.

For example, for a web/backend goal, if teaching HTTP, do not stop at:

- GET
- POST
- PUT
- DELETE

Also consider relevant concepts such as:

- request and response structure
- headers
- status codes
- path parameters
- query parameters
- request body
- content types
- JSON
- cookies
- caching
- idempotency
- authentication headers
- error responses

This HTTP example applies only to web/backend-related goals.

For other domains, decompose major topics using concepts relevant to that domain.

Only include concepts relevant to the requested goal.

==================================================
7. PRACTICE
==================================================

Learning must include practical work.

Do not make every Step theoretical.

Introduce practice progressively.

Use:

concept
→ small exercise
→ implementation
→ mini project
→ larger project

Examples:

- implement a small utility
- build a CLI tool
- create a REST endpoint
- connect an application to a database
- implement authentication
- write tests
- deploy an application

These examples apply only when relevant to the selected domain.

Do not turn every single Step into a project.

==================================================
8. PROJECT PROGRESSION
==================================================

Projects should increase in complexity.

Use a progression such as:

small practice project
→ mini project
→ intermediate project
→ integrated project
→ final capstone

A project must only appear after the learner has learned the concepts needed to build it.

Do not put the final project at the beginning.

Do not make every Section a project.

==================================================
9. CAPSTONE
==================================================

The final project should combine the most important skills from the roadmap.

It should be realistic enough to demonstrate actual competence.

Break a large capstone into meaningful implementation Steps.

For example, a backend capstone may include:

- Define requirements.
- Design architecture.
- Design database schema.
- Implement core models.
- Implement CRUD operations.
- Add validation.
- Add authentication.
- Add authorization.
- Implement error handling.
- Add tests.
- Document the API.
- Containerize the application.
- Deploy the application.

This is only an example.

The capstone structure must be adapted completely to the selected career path.

Do NOT force web/backend concepts such as databases, CRUD, authentication, API documentation, or Docker into unrelated domains.

==================================================
10. TECHNOLOGY CONSISTENCY
==================================================

Once you choose a technology, remain consistent.

If you choose:

PHP + Laravel + MySQL

do not later introduce:

Node.js
Express
MongoDB

If you choose:

JavaScript + Node.js + Express + PostgreSQL

do not later switch to:

Laravel
MySQL
Django

Do not introduce technologies merely because they are popular.

Every technology must have a clear reason to exist in the learner's path.

==================================================
11. TECHNOLOGY DECISION RULE
==================================================

Whenever the roadmap requires choosing a library, framework, hosting platform, testing tool, validation library, ORM, or other technology, choose ONE specific technology.

Never present multiple alternatives inside a Step.

Bad:

"Use Joi or Zod for validation."

Good:

"Implement request validation using Zod."

Bad:

"Deploy to Render, Railway, or Fly.io."

Good:

"Deploy the application to Render."

Make the technology decision yourself based on the overall stack and goal.

Once selected, use the same technology consistently throughout the roadmap.

==================================================
12. TECHNICAL CONSISTENCY CHECK
==================================================

Before returning the roadmap, verify that every technology and concept appears only after its prerequisites have been introduced.

Do not introduce a technology before its first dedicated learning stage.

Do not introduce technologies that were not selected as part of the main technology path.

Never use phrases such as:

- "X or Y"
- "X/Y"
- "if needed"
- "for example, X or Y"

When a technology choice is necessary, choose ONE technology and use it consistently.

Do not introduce TypeScript unless TypeScript is explicitly selected as part of the roadmap's primary technology path.

Do not introduce SQLite when PostgreSQL is the selected production database unless there is a specific and necessary reason.

Avoid advanced topics that provide little value for the learner's goal.

Every advanced topic must justify its place by contributing directly to the requested career goal.

==================================================
13. DEPENDENCY VALIDATION
==================================================

Before returning the roadmap, check:

1. Every Step depends only on concepts introduced earlier.
2. No library is used before the learner learns the relevant ecosystem.
3. Domain-specific tools appear after the fundamentals they depend on.
4. Framework concepts appear after the relevant programming fundamentals.
5. Advanced concepts appear after their prerequisites.
6. Testing appears after the application or system architecture exists when testing is relevant.
7. Deployment appears after the application or system can run correctly.
8. The capstone uses only technologies and concepts already introduced.

Apply these rules according to the actual domain.

Do NOT force irrelevant dependencies onto unrelated career paths.

If any dependency is incorrect, reorder or rewrite the affected Step.

==================================================
14. AVOID FILLER
==================================================

Never generate generic filler Steps.

Avoid:

"Learn best practices."

"Explore advanced concepts."

"Practice coding."

"Learn modern technologies."

"Study more about the topic."

"Understand the basics."

Every Step must specify exactly WHAT the learner should learn or practice.

==================================================
15. AVOID DUPLICATION
==================================================

Do not repeat the same learning objective across multiple Sections.

If a concept is revisited later, the later Step must extend or apply it.

For example:

Early:

"Understand functions."

Later:

"Use higher-order functions to structure reusable application logic."

The second Step builds upon the first.

==================================================
16. DIFFICULTY PROGRESSION
==================================================

The roadmap should progressively increase in difficulty.

The learner should move through:

Foundations
→ Core concepts
→ Applied concepts
→ Integration
→ Advanced practical skills
→ Production skills
→ Capstone

This sequence is a general progression pattern, not a mandatory subject order.

Adapt the progression to the actual career path.

Do not jump randomly between beginner and advanced topics.

==================================================
17. TIME AND REALISM
==================================================

The learner has:

{$data['hours_per_day']} hours per day.

The target date is:

{$data['deadline']}

Use these constraints to control scope.

Do not attempt to teach every technology or every advanced topic in the industry.

Prioritize the knowledge that provides the highest value toward the requested goal.

If the deadline is short:

REMOVE low-value topics.

Do NOT simply make the roadmap shallow.

If the goal is narrow, reduce the number of Sections and Steps accordingly.

If the goal is broad and the available time allows it, provide sufficient depth.

==================================================
18. PROFESSIONAL STANDARD
==================================================

Imagine that this roadmap will be used by a serious learner who wants to become employable.

The roadmap should cover the important knowledge required for the requested role.

It should not look like a generic AI-generated list of buzzwords.

It should feel like a curriculum designed by an experienced engineer and educator.

==================================================
19. FINAL QUALITY CHECK
==================================================

Before returning the result, mentally review the entire roadmap.

Ask:

- Does the roadmap actually lead toward the requested goal?
- Did I choose one coherent technology path?
- Are prerequisites placed before dependent concepts?
- Are broad topics decomposed into meaningful Steps?
- Are the Steps concrete?
- Is there enough depth for the goal and deadline?
- Are there practical exercises?
- Are projects progressively harder?
- Is the capstone appropriate?
- Did I avoid unnecessary technologies?
- Did I avoid alternatives?
- Did I avoid generic filler?
- Did I avoid duplication?
- Does difficulty increase naturally?
- Is the roadmap realistic for the available study time?
- Does the roadmap feel like a real professional curriculum?
- Did I accidentally force backend/web concepts into an unrelated domain?
- Did I introduce any technology before its prerequisites?
- Did I introduce any technology that was not selected as part of the main path?

If an existing Step is too shallow, improve that Step before adding new Steps.

Do not add extra Steps merely to make the roadmap look more detailed.

==================================================
20. OUTPUT
==================================================

Return ONLY valid JSON.

No Markdown.

No code fences.

No explanations.

Use exactly this structure:

{
  "title": "...",
  "description": "...",
  "sections": [
    {
      "title": "...",
      "steps": [
        {
          "title": "..."
        }
      ]
    }
  ]
}

Allowed fields ONLY:

title
description
sections
sections[].title
sections[].steps
sections[].steps[].title

Do NOT generate:

- IDs
- user IDs
- roadmap IDs
- section IDs
- step IDs
- order values
- completion values
- dates
- progress
- database fields
- relationships

Laravel will handle those responsibilities.

Your responsibility is ONLY to generate the curriculum.

Generate a balanced, practical roadmap.

Prefer quality and clarity over maximum length.

Do not add extra Steps merely to increase detail.
PROMPT;
    }
}
