const express = require('express');

const router = express.Router();
const { db } = require('../conf');

router.get('/', async (req, res) => {
  const [users] = await db.query(`
  SELECT firstName, lastName, quality, photo, campusName, age, animal,animalName,favoriteDish,wildSide,hobby,skill,motivation
  FROM users AS u
  INNER JOIN campus AS c ON u.campusId = c.id
  INNER JOIN informations AS i ON u.informationsId = i.id
  `);
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query(
      `
      SELECT firstName, lastName, quality, photo, campusName, age, animal,animalName,favoriteDish,wildSide,hobby,skill,motivation
      FROM users AS u
      INNER JOIN campus AS c ON u.id = c.id
      INNER JOIN informations AS i ON u.id = i.id
      WHERE id=?
    `,
      [id]
    );
    if (user.length) res.json(user);
    else throw new Error('No user found!');
  } catch (err) {
    console.warn(err);
    res.status(404).send();
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      quality,
      photo,
      campusName,
      campusId,
      informationsId,
      age,
      animal,
      animalName,
      favoriteDish,
      wildSide,
      hobby,
      skill,
      motivation,
    } = req.body;
    console.log(req.body);
    await db.query(
      `
      INSERT INTO campus (campusName)
      VALUES (?);
      `,
      [campusName]
    );
    await db.query(
      `
        INSERT INTO informations (age, animal,animalName,favoriteDish,wildSide,hobby,skill,motivation)
        VALUES (?,?,?,?,?,?,?,?);
        `,
      [
        age,
        animal,
        animalName,
        favoriteDish,
        wildSide,
        hobby,
        skill,
        motivation,
      ]
    );
    const [resSql] = await db.query(
      `
          INSERT INTO users (firstName, lastName, quality, photo, campusId, informationsId)
          VALUES (?,?,?,?,?,?);
        `,
      [firstName, lastName, quality, photo, campusId, informationsId]
    );

    const newData = {
      ...req.body,
      campusId: resSql.campusId,
      informationsId: resSql.informationsId,
    };
    res.status(201).json(newData);
  } catch (err) {
    console.log(err);
    res.status(404).send('error here !');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query(
    `
    DELETE FROM users
    WHERE id=?
    `,
    [id]
  );
  res.status(204).send();
});

router.put('/:id', async (req, res) => {
  const {
    firstName,
    lastName,
    quality,
    photo,
    campusName,
    age,
    animal,
    animalName,
    favoriteDish,
    wildSide,
    hobby,
    skill,
    motivation,
  } = req.body;
  // eslint-disable-next-line no-unused-vars
  const { id } = req.params;
  // eslint-disable-next-line no-unused-vars
  const resSql = await db.query(
    `
    UPDATE users
    Set firstName=?, lastName=?, quality=?, photo=?, campusName=?, age=?, animal=?,animalName=?,favoriteDish=?,wildSide=?,hobby=?,skill=?,motivation=?
    WHERE id=?
  `,
    [
      firstName,
      lastName,
      quality,
      photo,
      campusName,
      age,
      animal,
      animalName,
      favoriteDish,
      wildSide,
      hobby,
      skill,
      motivation,
    ]
  );
  res.status(204).send();
});

module.exports = router;
