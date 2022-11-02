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
using StaffPanel.Pages;
using Microsoft.UI.Windowing;
using Microsoft.UI;
using Microsoft.UI.Xaml.Media.Animation;
using Microsoft.UI.Xaml.Controls;

namespace StaffPanel
{
    public sealed partial class MainWindow : Window
    {
        private AppWindow _apw;
        private OverlappedPresenter _presenter;
        public static Frame mainFrame;

        public MainWindow()
        {
            this.InitializeComponent();
            
        }

        public void GetAppWindowAndPresenter()
        {
            var hWnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
            WindowId myWndId = Microsoft.UI.Win32Interop.GetWindowIdFromWindow(hWnd);
            _apw = AppWindow.GetFromWindowId(myWndId);
            _presenter = _apw.Presenter as OverlappedPresenter;
        }

        private void myButton_Click(object sender, RoutedEventArgs e)
        {
            //MainFrame.Content = new Setup_Wizard();
            mainFrame = MainFrame;
            MainFrame.Navigate(typeof(Setup_Wizard), null, new EntranceNavigationTransitionInfo());
            GetAppWindowAndPresenter();
            
            _presenter.IsResizable = false;
            /*using var reader = StaffPanel.SQL.Query.MakeQuery("SELECT * FROM `users`;");
            while (reader.Read())
            {
                myButton.Content = "" + reader["identifier"].ToString() + reader["accounts"].ToString() + reader["group"].ToString() + reader["job"].ToString();
            }*/
        }
    }
}
