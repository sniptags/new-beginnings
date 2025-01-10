const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const dataFilePath = path.join(__dirname, '../data.json');
const secretKey = 'my_secret_key'; // Replace with a secure key

class User {
    constructor(username, password,moodLogs) {
        this.username = username;
        this.password = password;
        this.moodLogs = moodLogs || [];
    }

    logMood(mood, reason, productivity) {
        const entry = {
            mood,
            reason,
            productivity,
            date: new Date().toISOString()
        };
        this.moodLogs.push(entry);
        this.saveData();
    }

    saveData() {
        fs.readFile(dataFilePath, 'utf8', (err, data) => {
            if (err) throw err;
            let users = JSON.parse(data);
            users[this.username] = { password: this.password, moodLogs: this.moodLogs };
            fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) throw err;
            });
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                let users = JSON.parse(data);
                users[this.username] = { password: this.password, moodLogs: this.moodLogs };
                fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
    }

    static getUserData(username) {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const users = JSON.parse(data);
                resolve(users[username] || null);
            });
        });
    }

    static authenticate(username, password) {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const users = JSON.parse(data);
                const user = users[username];
                if(!user){
                    reject('User not found');
                    return
                }
                if (user && user.password === password) {
                    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
                    user.tokens.push(token);
                    resolve(token);
                } else {
                    reject('Authentication failed');
                }
            });
        });
    }
}

module.exports = User;