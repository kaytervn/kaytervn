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
    public partial class fGiayKhaiTu : Form
    {
        KhaiTu kt = new KhaiTu();
        Bitmap bitmap;
        ThuongTruDAO ttDAO = new ThuongTruDAO();

        public fGiayKhaiTu(KhaiTu kt)
        {
            InitializeComponent();
            this.kt = kt;
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
            btMaCD.Text = kt.CongDan.MaCD.ToString();
            btHoTen.Text = kt.CongDan.HoTen;
            btNgaySinh.Text = kt.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh.Text = kt.CongDan.NoiSinh;

            if (kt.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh.Text = "Nam";
            else
                btGioiTinh.Text = "Nữ";

            btNgheNghiep.Text = kt.CongDan.NgheNghiep;
            btDanToc.Text = kt.CongDan.DanToc;
            btTonGiao.Text = kt.CongDan.TonGiao;

            if (kt.CongDan.HonNhan == (int)CongDan.enCD.DaKetHon)
                btHonNhan.Text = "Đã kết hôn";
            else
                btHonNhan.Text = "Độc thân";
            
            if (kt.CongDan.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(kt.CongDan.Hinh));

            btNgayKhai.Text = kt.NgayKhai.ToString("dd-MM-yyyy");
            btNgayTu.Text = kt.NgayTu.ToString("dd-MM-yyyy");
            btNguyenNhan.Text = kt.NguyenNhan;
            btNguoiKhai.Text = kt.CanCuocCongDan.CongDan.HoTen;
            btQuanHe.Text = kt.QuanHeVoiNguoiDuocKhai;

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(kt.CongDan.MaCD);
            if (tt != null)
            {
                btMaHo.Text = tt.MaHo.ToString();
                btTinhThanh.Text = tt.HoKhau.TinhThanh;
                btQuanHuyen.Text = tt.HoKhau.QuanHuyen;
                btPhuongXa.Text = tt.HoKhau.PhuongXa;
            }
            else
            {
                btMaHo.Text = "";
                btTinhThanh.Text = "";
                btQuanHuyen.Text = "";
                btPhuongXa.Text = "";
            }
        }

        private void fGiayKhaiTu_Load(object sender, EventArgs e)
        {
            LoadThongTin();
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

        private void printDocument1_PrintPage(object sender, System.Drawing.Printing.PrintPageEventArgs e)
        {
            e.Graphics.DrawImage(bitmap, 0, 0);
        }
    }
}
