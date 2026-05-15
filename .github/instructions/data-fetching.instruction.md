---
description : Read this file to understand how to fetch data from the database in your application.

---

# Data Fetching Instructions
this document outlies the best practices and guidelines for fetching data in our next.js application. Following these instructions will help ensure that our application is efficient, maintainable, ensure consistency , performance , and maintainability across the codebase.

## 1. use server components for the data fetching
In next.js, we recommend using server components for data fetching whenever possible. Server components allow you to fetch data on the server side

## 2. Data Fetching Methods
Always use the helper functions in the /data directory to fetch data . NEVER  fetch data directly in your components. 

ALL helper functions in the /data directory should use Drizzle ORM to interact with the database interactions.