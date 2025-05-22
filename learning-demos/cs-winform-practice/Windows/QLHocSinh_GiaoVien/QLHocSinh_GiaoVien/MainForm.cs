using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QLHocSinh_GiaoVien
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            QLHocSinhForm hs = new QLHocSinhForm();
            this.Hide();
            hs.Show();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            ControlBox = false;
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void btnGV_Click(object sender, EventArgs e)
        {
            QLGiaoVienForm gv = new QLGiaoVienForm();
            gv.Show();
            Visible = false;
        }

        private void button1_Click_1(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        private void btnGV_CursorChanged(object sender, EventArgs e)
        {
            
        }
    }
}
