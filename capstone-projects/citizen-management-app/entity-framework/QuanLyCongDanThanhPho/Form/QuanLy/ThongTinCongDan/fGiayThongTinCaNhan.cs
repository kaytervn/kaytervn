using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public partial class fGiayThongTinCaNhan : Form
    {
        CongDan cd = new CongDan();
        Bitmap bitmap;
        ThuongTruDAO ttDAO = new ThuongTruDAO();

        public fGiayThongTinCaNhan(CongDan cd)
        {
            InitializeComponent();
            this.cd = cd;
        }

        void TaoManHinhIn()
        {
            Panel panel = new Panel();
            this.Controls.Add(panel);

            Graphics graphics = panel.CreateGraphics();
            Size size = this.ClientSize;
            bitmap = new Bitmap(size.Width, size.Height, graphics);
            graphics = Graphics.FromImage(bitmap);

            Point point = PointToScreen(panel.Location);
            graphics.CopyFromScreen(point.X, point.Y, 0, 0, size);
        }

        void LoadThongTin()
        {
            btMaCD.Text = cd.MaCD.ToString();
            btHoTen.Text = cd.HoTen;
            btNgaySinh.Text = cd.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh.Text = "Nam";
            else
                btGioiTinh.Text = "Nữ";

            btNgheNghiep.Text = cd.NgheNghiep;
            btDanToc.Text = cd.DanToc;
            btTonGiao.Text = cd.TonGiao;

            if (cd.HonNhan == (int)CongDan.enCD.DaKetHon)
                btHonNhan.Text = "Đã kết hôn";
            else
                btHonNhan.Text = "Độc thân";

            if (cd.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(cd.Hinh));

            btTenTK.Text = cd.TenTK;

            btMatKhau.Text = cd.MatKhau;

            if (cd.LoaiTK == (int)CongDan.enCD.CongDan)
                btLoaiTK.Text = "Công dân";
            else
                btLoaiTK.Text = "Quản lý";
        }

        private void printDocument1_PrintPage(object sender, System.Drawing.Printing.PrintPageEventArgs e)
        {
            e.Graphics.DrawImage(bitmap, 0, 0);
        }

        private void btIn_Click(object sender, EventArgs e)
        {
            btIn.Visible = false;
            TaoManHinhIn();
            btIn.Visible = true;
            DialogResult result = printDialog1.ShowDialog();
            if (result == DialogResult.OK)
                printPreviewDialog1.ShowDialog();
        }

        private void fGiayThongTinCaNhan_Load(object sender, EventArgs e)
        {
            LoadThongTin();
        }
    }
}
