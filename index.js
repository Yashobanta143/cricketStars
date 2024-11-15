import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import multer from "multer";
import session from "express-session";
import mysql from "mysql";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


app.use(session({
  secret: 'happiness',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}));


function database() {
  const db = mysql.createConnection({
    // Database connection settings
    host: 'localhost',
    user:'Bablu',
    password :'bablu12345',
    database :'cricketstars',
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    // console.log('Connected to MySQL');
  });
  return db;
}






app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});


app.get("/logIn", (req, res) => {
  res.render("login.ejs");
});  

app.post("/registered", (req, res) => {
  const userName = req.body.userName;
  const phNo = req.body.mobNo;
  const password = req.body.password;
  // Hash password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = "INSERT INTO user (username,phno,password) VALUES ('"+userName+"', '"+phNo+"', '"+hashedPassword+"')";
  database().query(query, (err, results) => {
    if (err) {
      console.error('Error registering user:', err);
    } else {
      res.render("registered.ejs");
    }
  });
  database().end();
}); 


app.post("/main", (req, res) => {
    const phNo = req.body.mobNo;
    const password = req.body.password;  
    database().query('SELECT * FROM user WHERE phno = ?', [phNo], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send({ message: 'Error querying database' });
      } else if (results.length === 0) {
        res.status(401).send({ message: 'Invalid Phone number or password' });
      } else {
        const hashedPassword = results[0].password;
        const userName = results[0].username;
        // Compare provided password with hashed password
        bcrypt.compare(password, hashedPassword, (err, match) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).send({ message: 'Error comparing passwords' });
          } else if (!match) {
            res.status(401).send({ message: 'Invalid username or password' });
          } else {
            // Login successful
            req.session_authenticated = true;
            req.session_userdata = { userName };
            res.redirect('/protected?user=' + userName);
          }
        });
      }
    });
    database().end();                                     
}); 


// Protected route
app.get('/protected', (req, res) => {
  const user = req.query.user;
  if (req.session_authenticated = true) {
    database().query(`SELECT * FROM userinfo WHERE user = ?`, [user], (err, results) => {
      if (err) {
        console.error(err);
      } else {
        if (results.length > 0) {
          // console.log('Record exists');
          results.forEach(element => {
            const userData = {
            user : element.user,
            userDp : element.dp,
            phno : element.phno,
            email : element.email,
            role : element.role,
            bat : element.bat,
            bowl : element.bowl,
            achievement : element.achievement,
            }
            const defaultImage = 'images/default-image.png';
            res.render("main.ejs", {userData, defaultImage})
          });
        } else {
          console.log('Record does not exist');
          const userData = "";
          const defaultImage = 'images/default-image.png';
          res.render("main.ejs", {userData, user, defaultImage});
        }
      }
    });
    database().end();
  } else {
    console.log("not authorised")
    res.redirect('/login');
  }
});


// Save data to MySQL database
app.post("/saveBtn", async (req, res) => {
  const { user, tourname, venue, date, host, contact, entry, winner, runner, boundary, ball, rules } = req.body;
  const query = "INSERT INTO list_of_tournaments (user, tourname, venue, date, host, contact, entry, winner, runner, boundary, ball, rules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  database().query(query,
    [user, tourname, venue, date, host, contact, entry, winner, runner, boundary, ball, rules], 
    (err, results) => {
    if (err) {
      console.error('error saving:', err);
      res.status(500).send({ message: 'Error saving data' });
    } else {
      console.log("Successfully Saved");
    }
  });
  database().end();
});


app.get("/profile", (req, res) => {
  const id = req.query.user;
  database().query(`SELECT * FROM userinfo WHERE user = ?`, [id], (err, results) => {
    if (err) {
      console.error(err);
    } else {
      if (results.length > 0) {
        // console.log('Record exists');
        results.forEach(element => {
          const userData = {
          user : element.user,
          userDp : element.dp,
          phno : element.phno,
          email : element.email,
          role : element.role,
          bat : element.bat,
          bowl : element.bowl,
          achievement : element.achievement,
          }
          const defaultImage = 'images/default-image.png';
          res.render("profile.ejs", {userData, defaultImage})
        });
      } else {
        console.log('Record does not exist');
        const userData = "";
        const defaultImage = 'images/default-image.png';
        res.render("profile.ejs", {userData, id, defaultImage});
      }
    }
  });
  database().end();

});


app.get("/editprofile", (req, res) => {
  const user = req.query.user;
  database().query(`SELECT * FROM userinfo WHERE user = ?`, [user], (err, results) => {
    if (err) {
      console.error(err);
    } else {
      if (results.length > 0) {
        // console.log('Record exists');
        results.forEach(element => {
          const userData = {
          user : element.user,
          phno : element.phno,
          email : element.email,
          role : element.role,
          bat : element.bat,
          bowl : element.bowl,
          achievement : element.achievement,
          }
          res.render("editprofile.ejs", {userData})
        });
      } else {
        // console.log('Record does not exist');
        const userData = "";
        res.render("editprofile.ejs", {userData, user});
      }
    }
  });
  database().end();

})


app.get("/editdp", (req, res) => {
  const user = req.query.user;
  const query = 'SELECT dp FROM userinfo WHERE user = ?';
  database().query(query, user, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      const userDp = results[0].dp;
      res.render("editdp.ejs", {user, userDp});
    }
  });
  database().end();
})


app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/public/about .html");
});


app.get('/getUrl', (req, res) => {
  const query = 'SELECT tourname FROM list_of_tournaments';
  database().query(query,(err, results) => {
    if (err) {
      console.error('error running query', err);
      res.status(500).send({ message: 'Error querying database' });
    } else {
      const data = results.map((data) => data.tourname);
      res.json(data);
    }
  });
  database().end();

})


app.get("/tournament", (req, res) => {
  const user = req.body.user;
  const tourname = req.query.tourname;

  const query = 'SELECT * FROM list_of_tournaments WHERE tourname = ?';
  database().query(query, tourname, (err, results) => {
    if (err) {
      console.error('error running query', err);
      res.status(500).send({ message: 'Error querying database' });
    } else {
      results.forEach(element => {
          const tournamentData = {
           user : element.user,
           tourname: element.tourname,
           venue : element.venue,
           date : element.date,
           host : element.host,
           contact : element.contact,
           entry : element.entry,
           winner : element.winner,
           runner : element.runner,
           boundary : element.boundary,
           ball : element.ball,
           rules : element.rules,
          }
        res.render("tournament.ejs", {tournamentData, user})
      });
    }
  });
  database().end();
});


const upload = multer({ dest: './uploads', limits: { fileSize: 50 * 1024 * 1024 },//50mb
}); 


app.post('/upload-image', upload.single('image'), (req, res) => {
  console.log(req.file);
  const filePath = req.file.path;
  const user = req.body.user;
  console.log(user)
  const query = 'UPDATE userinfo SET dp = ? WHERE user = ?';
  const data = [filePath, user];
  database().query(query, data, (err, results) => {
    if (err) {
      console.error('Error updating image:', err);
    } else {
      console.log("success");
    }
  });
  database().end();
});


app.post('/save-profile', async (req, res) => {
  console.log(req.body)
  const { user, phno, email, role, bat, bowl, achievement } = req.body;

  // Check if fields are empty
  // if (!role || !bat || !bowl) {
  //   return res.status(400).json({ error: 'All fields are required' });
  // }

  database().query(`SELECT * FROM userinfo WHERE user = ?`, [user], (err, results) => {
    if (err) {
      console.error(err);
    } else {
      if (results.length > 0) {
        console.log('Record exists');
        // Update data in userinfo table
        // const { user, phno, email, role, bat, bowl, acheivement } = req.body;
        const query = "UPDATE userinfo SET user = ?, phno = ?, email = ?, role = ?, bat = ?, bowl = ?, achievement = ? WHERE user = ?";
        database().query(query, [user, phno, email, role, bat, bowl, achievement, user], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Error updating data" });
            } else {
                res.send({ message: "Data updated successfully" });
            }
        });
        database().end();

      } else {
        console.log('Record does not exist');
        // Validate input data
        if (!user || !phno || !email || !role || !bat || !bowl || !achievement) {
          return res.status(400).send({ message: "All fields are required" });
        }
          // SQL query to insert data into userinfo table
        const query = "INSERT INTO userinfo (user, phno, email, role, bat, bowl, achievement) VALUES (?, ?, ?, ?, ?, ?, ?)";

        database().query(query,[user, phno, email, role, bat, bowl, achievement],(err, results) => {
            if (err) {
              console.error("Error saving:", err);
              return res.status(500).send({ message: "Error saving data" });
            }
            res.send({ message: "Data saved successfully" });
          }
        );
        database().end();
      }
    }
  });
  database().end();

})


app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('session is destroyed')
        res.render("logout.ejs");
      }
    });
  } else {
    console.error('Session is undefined');
  }
});

// Profile page route
app.get('/searchprofile', (req, res) => {
  const username = req.query.user;
  const sql = "SELECT * FROM userinfo WHERE user = ?";
  database().query(sql, [username], (err, results) => {
    if (err) {
      console.error('error running query:', err);
      res.status(404).send({ message: 'User not found' });
    } else {
      results.forEach(element => {
        const userData = {
        user : element.user,
        userDp : element.dp,
        phno : element.phno,
        email : element.email,
        role : element.role,
        bat : element.bat,
        bowl : element.bowl,
        achievement : element.achievement,
        }
        res.render("searchprofile.ejs", {userData})
      });
    }
  });
  database().end();
});

app.get('/search', (req, res) => {
  const query = req.query.search;
  const username = req.query.user;
  const sql = "SELECT user, dp FROM userinfo WHERE user LIKE ?";
  database().query(sql, ['%' + query + '%'], (err, results) => {
    if (err) {
      console.error('error running query:', err);
      res.status(500).send({ message: 'Error searching users' });
    } else {
      if (results.length > 0) {
        const userData = results;
        res.render("search.ejs", {username, query, userData});
      } else {
        const userData = "";
        res.render("search.ejs", {username, query, userData});
      }
    }
  });
  database().end();
  
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
