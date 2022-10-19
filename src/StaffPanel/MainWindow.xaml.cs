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
        static string query = "SELECT * FROM test";
        public MainWindow()
        {
            this.InitializeComponent();
        }

        private void myButton_Click(object sender, RoutedEventArgs e)
        {
            using var reader = StaffPanel.SQL.Query.MakeQuery("SELECT * FROM `users`;");
            while (reader.Read())
            {
                myButton.Content = "" + reader["identifier"].ToString() + reader["accounts"].ToString() + reader["group"].ToString() + reader["job"].ToString();
            }
        }
    }
}
