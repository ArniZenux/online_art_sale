import fs from 'fs'; 
const dbFile = './onlineART.db';

function delete_Database() {
  fs.access(dbFile, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Database file does not exist.');
    } else {
      // Delete the SQLite database file
      fs.unlink(dbFile, (err) => {
        if (err) {
          console.error('Error deleting the database file:', err.message);
        } else {
          console.log('Database file deleted successfully.');
        }
      });
    }
  });
}

delete_Database(); 