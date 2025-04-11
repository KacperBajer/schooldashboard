"use server";
import puppeteer from "puppeteer";
import { getUser } from "./user";



const contentStudent = (firstName: string, lastName: string, birthday: string, PESEL: string, schoolType: string, releaseDate: string, ID: string, image: unknown) => `
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1006, height=640">
    <title>Informacje</title>
    <style>
        body {
            width: 1004px;
            height: 626px;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 23px;
            font-weight: 800;
        }
        .page {
            width: 1004px;
            height: 626px;
            page-break-after: always;
        }
        .content {
          position: relative;
        }
        .image {
          position: relative;
        }
        .photodiv {
         position: absolute;
          left: 60px;
          top: 190px;
          width: 250px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }
        .photo {
          width: 100%;
          max-width: 250px;
          height: fit;
          max-height: 300px;
          object-fit: contain;
        }
        .name { position: absolute; left: 350px; top: 165px; }
        .birthday { position: absolute; left: 350px; top: 240px; }
        .PESEL { position: absolute; left: 680px; top: 240px; }
        .schoolType { position: absolute; left: 350px; top: 320px; }
        .headmaster { position: absolute; left: 350px; top: 455px; }
        .releaseDate { position: absolute; left: 350px; top: 525px; }
        .ID { position: absolute; left: 60px; top: 570px; }
    </style>
</head>
<body>
    <div class="page"></div>
    <div class="page content">
        <p class="name">${firstName} ${lastName}</p>
        <p class="birthday">${birthday}</p>
        <p class="PESEL">${PESEL}</p>
        <p class="schoolType">${schoolType} w Zespole Szkół nr 1 <br />
        im. Kazimierza Wielkiego w Mińsku Mazowieckim <br />
        ul. Budowlana 4, 05-300 Mińsk Mazowiecki</p>
        <p class="headmaster">Adam Trześkowski</p>
        <p class="releaseDate">${releaseDate}</p>
        <p class="ID">${ID}</p>
    </div>
    <div class="page image">
      <div class="photodiv">
        <img class="photo" src="${image}" alt="Zdjęcie ucznia" />
      </div>
    </div>
</body>
</html>`;

const contentTeacher = (firstName: string, lastName: string, releaseDate: string, ID: string, image: unknown) => `
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1006, height=640">
    <title>Informacje</title>
    <style>
        body {
            width: 1004px;
            height: 626px;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 23px;
            font-weight: 800;
        }
        .page {
            width: 1004px;
            height: 626px;
            page-break-after: always;
        }
        .content {
          position: relative;
        }
        .image {
          position: relative;
        }
        .photodiv {
         position: absolute;
          left: 60px;
          top: 190px;
          width: 250px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }
        .photo {
          width: 100%;
          max-width: 250px;
          height: fit;
          max-height: 300px;
          object-fit: contain;
        }
        .firstname { position: absolute; left: 350px; top: 200px; }
        .lastname { position: absolute; left: 350px; top: 265px; }
        .releaseDate { position: absolute; left: 350px; top: 330px; }
        .ID { position: absolute; left: 350px; top: 395px; }
        .back { position: absolute; left: 70px; top: 100px; }
    </style>
</head>
<body>
    <div class="page"></div>
    <div class="page content">
        <p class="firstname">${firstName}</p>
        <p class="lastname">${lastName}</p>
        <p class="releaseDate">${releaseDate}</p>
        <p class="ID">${ID}</p>
    </div>
    <div class="page image">
      <div class="photodiv">
        <img class="photo" src="${image}" alt="Zdjęcie nauczyciela" />
      </div>
    </div>
    <div class="page image">
      <p class="back">ZESPÓŁ SZKÓŁ NR 1 IM. KAZIMIERZA </br>
WIELKIEGO W MIŃSKU MAZOWIECKIM </br>
UL. BUDOWLANA 4 </br>
05-300 MIŃSK MAZOWIECKI</p>
    </div>
</body>
</html>`;

export const schoolIDStudentCard = async (firstName: string, lastName: string, birthday: string, PESEL: string, schoolType: string, releaseDate: string, ID: string, image: unknown) => {
  try {

    const user = await getUser()
    if(!user || !user.permissions["can_see_school-id_section"] ) return 'err'

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(contentStudent(firstName, lastName, birthday, PESEL, schoolType, releaseDate, ID, image), { waitUntil: "domcontentloaded" });

    await page.setViewport({
      width: 1004,
      height: 626,
    });

    const pdfBuffer = await page.pdf({
      width: "1006px",
      height: "640px",
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.log(error);
    return 'err'
  }
};

export const schoolIDTeacherCard = async (firstName: string, lastName: string, releaseDate: string, ID: string, image: unknown) => {
  try {

    const user = await getUser()
    if(!user || !user.permissions["can_see_school-id_section"] ) return 'err'

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(contentTeacher(firstName, lastName, releaseDate, ID, image), { waitUntil: "domcontentloaded" });

    await page.setViewport({
      width: 1004,
      height: 626,
    });

    const pdfBuffer = await page.pdf({
      width: "1006px",
      height: "640px",
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.log(error);
    return 'err'
  }
};