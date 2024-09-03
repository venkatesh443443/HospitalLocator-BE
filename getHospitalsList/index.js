const sql = require('mssql');
module.exports = async function (context, req) {

    const connectionString = process.env.SqlConnectionString;

     const pool = new sql.ConnectionPool(connectionString);
     await pool.connect();

    try {
        // Check if the request method is POST
        if (req.method === "GET") {

            // TODO : Add 'Address' column in the query
             const query = `
                 SELECT ID, Name, Latitude, Longitude, SpecialitiesAvailable, Address FROM Hospitals;
             `;
            
             const result = await pool.request()
                 .query(query);

             context.res = {
                 status: 200,
                 body: result.recordset
             };
        } else {
            context.res = {
                status: 400,
                body: { message: 'Please send a GET request' }
            };
        }
    } catch (error) {
        context.log.error('Error during fetching data:', error);
        context.res = {
            status: 500,
            body: { message: "Error while fetching hospitals' data" }
        };
    } finally {
        // Close the SQL connection
        await pool.close();
    }
};
