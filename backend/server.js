import express from "express";
import fs from "fs";
import adsItems from "./files/newAds.json" assert { type: "json" };

const app = express();
const port = 8000;

let currentIndex = 0;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-with,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const isUniqAd = (ad, processedAds) => {
  return !processedAds.some(exitingAd => exitingAd.id === ad.id);
};

app.get("/", (req, res) => {
  res.setHeader("Transfer-Encoding", "chunked");

  const itemsPart = adsItems.slice(currentIndex, currentIndex + 10);
  res.json({ data: itemsPart });
});

app.post("/", (req, res) => {
  const reqData = req.body;
  if (!reqData) return req.sendStatus(400);

  fs.readFile("./files/processedAds.json", "utf8", (err, data) => {
    let processedAds = [];

    if (data) {
      processedAds = JSON.parse(data);
    }

    const newAds = reqData.filter(ad => isUniqAd(ad, processedAds));

    processedAds = [...processedAds, ...newAds];

    if (newAds.length === 0) {
      return res
        .status(409)
        .send({ message: "Все объявления уже обработаны", data: [] });
    }

    fs.writeFile(
      "./files/processedAds.json",
      JSON.stringify(processedAds, null, 2),
      err => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Ошибка записи файла", data: [] });
        }

        currentIndex += 10;

        const nextItemsPart = adsItems.slice(currentIndex, currentIndex + 10);

        if (nextItemsPart.length > 0) {
          res.send({
            message: "Данные успешно записаны в файл",
            data: nextItemsPart,
          });
        } else {
          res.send({
            message:
              "Данные успешно записаны в файл, все данные уже отправлены",
            data: [],
          });
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log("work on " + port);
});
