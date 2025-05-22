using System.Data.SqlClient;
using System.Data;

namespace BTTuan1
{
    public partial class FHocSinh : Form
    {
        HocSinhDAO hsDao = new HocSinhDAO();

        public FHocSinh()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            HienThiDanhSach();
        }

        private void HienThiDanhSach()
        {
            this.gvHsinh.DataSource = hsDao.LayDanhSachSinhVien();   
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            HocSinh hs = new HocSinh(txtName.Text, txtDiaChi.Text, txtCMND.Text);

            hsDao.Them(hs);

            HienThiDanhSach();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            HocSinh hs = new HocSinh(txtName.Text, txtDiaChi.Text, txtCMND.Text);

            hsDao.Xoa(hs);

            HienThiDanhSach();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            HocSinh hs = new HocSinh(txtName.Text, txtDiaChi.Text, txtCMND.Text);

            hsDao.Sua(hs);

            HienThiDanhSach();
        }

    }
}