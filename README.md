[comment]: <> (README Template --> https://github.com/othneildrew/Best-README-Template)



<!-- PROJECT SHIELDS -->
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h2 align="center">
    <a align="center" href="http://ec2-34-207-154-73.compute-1.amazonaws.com">Wind</a>
  </h2>

  <p align="center">
    Full Stack social media app, built using Golang, Typescript and SCSS
    <br />
    <a href="http://ec2-34-207-154-73.compute-1.amazonaws.com">View Demo</a>
    ·
    <a href="https://github.com/prestonkelly">Github</a>
    ·
    <a href="https://www.linkedin.com/in/prestonkelly1/">LinkedIn</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#what-i-learned">What I learned</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#running-locally">Running Locally</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

### Demo account details
user: demo
</br>
password: password1

<!-- ABOUT THE PROJECT -->
## About The Project

While searching for a challenging project to work on during my final semester in the College of Business at UCF, I settled on creating a social media website from scratch. I built on top of my previous experience and explored topics such as Redux and Axios Interceptors, constantly trying to challenge myself while learning from my mistakes along the way. This project allowed me to grow as a developer, and I focused on creating quality work that could be showcased on my resume.

#### [More photos are available here](https://github.com/prestonkelly/Wind/tree/master/readmePhotos)

[![Product Screen Shot][product-screenshot]](http://ec2-34-207-154-73.compute-1.amazonaws.com)


## Built With

### Languages
* Golang
* TypeScript
* SCSS

### Services
* Amazon EC2
  * Next.js app hosted using EC2 instance
* Amazon RDS
  * Postgresql database hosted on RDS
* Amazon S3
  * S3 Bucket used for storing user profile photos
  
### Frameworks and Library's
* [Next.js](https://nextjs.org/)
  * Wind is built on-top of `npx create-next-app`. I used create-next-app as a base for my frontend since I was fairly familiar with and enjoyed using Next.js. 
* [React](https://reactjs.org/)
  * I took advantage of React hooks such as useEffect and useState which allowed me to condense my code and create reusable components. 
* [Gin-Gonic](https://github.com/gin-gonic)
  * Gin is the web framework for Wind's backend, I chose this framework because of its speed and simplicity. Gin's extensive documentation allowed me to build a dynamic backend quickly, while keeping my code condensed.
* [React-Bootstrap](https://react-bootstrap.github.io/)
  * From buttons to modals, I utilized react-bootstrap for base styling.


<!-- WHAT I LEARNED -->
## What I learned

1. Golang
   * Introduced and developed a love for Go while developing the backend, which is built using Gin-Gonic as the web framework.
2. Typescript
   * I created strict types allowing me to fix type errors on compile time rather than runtime.
3. Axios interceptors
   * I implemented axios interceptors to silently refresh JWT tokens.
4. JSON Web Tokens (JWT)
   * I followed Victor Steven's tutorial [(see below)](#Acknowledgements) and learned all about access and refresh tokens. The tutorial didn't go into how to implement axios interceptors, though I was able to create a solution to silently refresh the JWT's on the front.
5. AWS Services
   * As I was developing the demo for Wind, I was exposed to multiple AWS Services. I took advantage of Amazon's free tier to launch an EC2 instance and configured nginx to serve as a reverse proxy for my Next.js app and Golang backend.
6. Redux
   * I learned how to store, update and delete user data in Redux. I persisted state for user preferences such as night mode and stored posts and post metadata on an initial login.

<!-- LICENSE -->
## License

Distributed under the MIT License. See [MIT-LICENSE](https://github.com/git/git-scm.com/blob/master/MIT-LICENSE.txt) for more information.

<!-- RUNNING LOCALLY -->
## Running Locally

1. Clone the repo
   ```sh
   git clone https://github.com/prestonkelly/Wind.git
   ```
2. CD into [web](https://github.com/prestonkelly/Wind/tree/master/web) and Install NPM packages
   ```sh
   npm install
   ```
3. Install [Golang](https://golang.org/dl/) and CD into [api](https://github.com/prestonkelly/Wind/tree/master/api) and Install the Go dependencies
    ```
    go get ./...
    ```
4. Download [Postgresql](https://www.postgresql.org/download/) and [Redis](https://redis.io/download) and set credentials in an ***.env*** file in the [api](https://github.com/prestonkelly/Wind/tree/master/web) directory.
   ```
   .env file
   
   // Enter a random string for the access and refresh tokens
   ACCESS_SECRET=
   REFRESH_SECRET=
   
   // Postgresql and Redis credentials do NOT have to be from AWS. User photos will not be available while running locally unless an S3 Bucket is setup.
   AWS_PG_PASSWORD=
   AWS_PG_HOST=
   AWS_PG_DATABASE=
   AWS_REGION=
   AWS_REDIS_ADDR=
   ```
5. Uncomment out lines 50-53 and 71-88 on the [dbConnect.go](https://github.com/prestonkelly/Wind/blob/master/api/controllers/dbConnect.go) file, this is for initial database setup. Register one user and, you can comment out for further runs of the program.
6. Start up the frontend and backend and register an initial user to initialize postgresql tables.
   ```
   cd web
   npm run dev
   
   cd api 
   go run main.go 
   ```

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* Victor Steven's JWT tutorial using Go
  * [Victor's JWT article](https://learn.vonage.com/blog/2020/03/13/using-jwt-for-authentication-in-a-golang-application-dr/)
  * [Victor's github](https://github.com/victorsteven)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/prestonkelly1/
[product-screenshot]: ./readmePhotos/demo1.png
