using Microsoft.Data.SqlClient;
using Microsoft.UI.Xaml;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MySqlConnector;

namespace StaffPanel
{
    public sealed partial class MainWindow : Window
    {
        static string connectionString = "datasource=127.0.0.1;port=3306;username=root;password=;database=test;";
        static string query = "SELECT * FROM test";
        public MainWindow()
        {
            this.InitializeComponent();
            MySqlConnection databaseConnection = new MySqlConnection(connectionString);
            MySqlCommand commandDatabase = new MySqlCommand(query, databaseConnection);
            commandDatabase.CommandTimeout = 500;
            
            try
            {
                databaseConnection.Open();

                MySqlDataReader reader = commandDatabase.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        myButton.Content = reader.GetString(0);
                    }
                }

                databaseConnection.Close();
            }
            catch(Exception error)
            {
                MessageBox.Show(error.ToString());
            }
        }
    }
}
