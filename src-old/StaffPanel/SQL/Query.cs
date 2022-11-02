using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StaffPanel.SQL
{
    public static class Query
    {
        static string connectionString = "datasource=127.0.0.1;port=3306;username=root;password=;database=test;";

        public static MySqlDataReader MakeQuery(string query)
        {
            MySqlConnection con = new MySqlConnection(connectionString);
            con.Open();
            MySqlCommand cmd = new MySqlCommand(query, con);
            MySqlDataReader reader = cmd.ExecuteReader();
            return reader;
        }
    }
}
