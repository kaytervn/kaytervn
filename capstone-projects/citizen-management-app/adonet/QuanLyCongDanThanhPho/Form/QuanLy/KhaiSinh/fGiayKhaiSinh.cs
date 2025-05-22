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
    public partial class fGiayKhaiSinh : Form
    {
        Bitmap bitmap;
        ThuongTruDAO ttDAO = new ThuongTruDAO();
        KhaiSinh ks;

        public fGiayKhaiSinh(KhaiSinh ks)
        {
            InitializeComponent();
            this.ks = ks;
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
            btMaCD.Text = ks.CongDan.MaCD.ToString();
            btHoTen.Text = ks.CongDan.HoTen;
            btNgaySinh.Text = ks.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh.Text = ks.CongDan.NoiSinh;

            if (ks.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh.Text = "Nam";
            else
                btGioiTinh.Text = "Nữ";

            btDanToc.Text = ks.CongDan.DanToc;
            btTonGiao.Text = ks.CongDan.TonGiao;

            if (ks.CongDan.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(ks.CongDan.Hinh));

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(ks.CongDan.MaCD);
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

            btNgayKhai.Text = ks.NgayKhai.ToString("dd-MM-yyyy");

            //Thông tin cha
            btCCCDCha.Text = ks.KetHon.CanCuocCongDan.CCCD;
            btHoTenCha.Text = ks.KetHon.CanCuocCongDan.CongDan.HoTen;
            btNgaySinhCha.Text = ks.KetHon.CanCuocCongDan.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinhCha.Text = ks.KetHon.CanCuocCongDan.CongDan.NoiSinh;

            //Thông tin mẹ
            btCCCDMe.Text = ks.KetHon.CanCuocCongDan1.CCCD;
            btHoTenMe.Text = ks.KetHon.CanCuocCongDan1.CongDan.HoTen;
            btNgaySinhMe.Text = ks.KetHon.CanCuocCongDan1.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinhMe.Text = ks.KetHon.CanCuocCongDan1.CongDan.NoiSinh;
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

        private void fGiayKhaiSinh_Load(object sender, EventArgs e)
        {
            LoadThongTin();
        }
    }
}
