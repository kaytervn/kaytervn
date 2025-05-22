using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    public partial class fDoanhThu : Form
    {
        HoaDonDAO hdDAO = new HoaDonDAO();
        public fDoanhThu()
        {
            InitializeComponent();
        }

        private void fDoanhThu_Load(object sender, EventArgs e)
        {
            dgvHoaDon.DataSource = hdDAO.LayDanhSach();
            tbTongDoanhThu.Text = hdDAO.TinhDoanhThu();
        }

        private void btnLoc_Click_1(object sender, EventArgs e)
        {
            
            dgvHoaDon.DataSource = hdDAO.LocDoanhThu(dtpkTu.Value, dtpkDen.Value);
            MessageBox.Show("Lọc Thành Công!");
            
        }

        private void dgvHoaDon_DataSourceChanged(object sender, EventArgs e)
        {
            double tongtt = 0;
            double tongtl = 0;
            for (int i = 0; i < dgvHoaDon.Rows.Count; i++)
            {
                tongtt += (double)dgvHoaDon.Rows[i].Cells[5].Value;
                tongtl += (double)dgvHoaDon.Rows[i].Cells[6].Value;
            }
            tbDoanhThuLoc.Text = tongtt.ToString();
            tbTienLoiLoc.Text = tongtl.ToString();
        }
    }
}
