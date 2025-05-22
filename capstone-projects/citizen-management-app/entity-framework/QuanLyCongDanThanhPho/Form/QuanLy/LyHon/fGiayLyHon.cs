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
    public partial class fGiayLyHon : Form
    {
        Bitmap bitmap;
        LyHon lh;
        ThuongTruDAO ttDAO = new ThuongTruDAO();

        public fGiayLyHon(LyHon lh)
        {
            InitializeComponent();
            this.lh = lh;
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
            btMaKH.Text = lh.MaKH.ToString();
            btNgayDK.Text = lh.KetHon.NgayDangKy.ToString("dd-MM-yyyy");
            btLyDo.Text = lh.LyDo;

            //Load thông tin Chồng
            if (lh.KetHon.CanCuocCongDan.CongDan.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(lh.KetHon.CanCuocCongDan.CongDan.Hinh));

            btCCCD.Text = lh.KetHon.CCCDChong;
            btMaCD.Text = lh.KetHon.CanCuocCongDan.MaCD.ToString();
            btHoTen.Text = lh.KetHon.CanCuocCongDan.CongDan.HoTen;
            btNgaySinh.Text = lh.KetHon.CanCuocCongDan.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh.Text = lh.KetHon.CanCuocCongDan.CongDan.NoiSinh;

            if (lh.KetHon.CanCuocCongDan.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh.Text = "Nam";
            else
                btGioiTinh.Text = "Nữ";

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(lh.KetHon.CanCuocCongDan.CongDan.MaCD);
            if (tt != null)
            {
                btThuongTru.Text = tt.MaHo.ToString();
                btTinhThanh.Text = tt.HoKhau.TinhThanh;
                btQuanHuyen.Text = tt.HoKhau.QuanHuyen;
                btPhuongXa.Text = tt.HoKhau.PhuongXa;
            }
            else
            {
                btThuongTru.Text = "";
                btTinhThanh.Text = "";
                btQuanHuyen.Text = "";
                btPhuongXa.Text = "";
            }

            //Load Thông tin Vợ
            if (lh.KetHon.CanCuocCongDan1.CongDan.Hinh != null)
                ptHinh1.Image = Image.FromStream(new MemoryStream(lh.KetHon.CanCuocCongDan1.CongDan.Hinh));

            btCCCD1.Text = lh.KetHon.CCCDVo;
            btMaCD1.Text = lh.KetHon.CanCuocCongDan1.MaCD.ToString();
            btHoTen1.Text = lh.KetHon.CanCuocCongDan1.CongDan.HoTen;
            btNgaySinh1.Text = lh.KetHon.CanCuocCongDan1.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh1.Text = lh.KetHon.CanCuocCongDan1.CongDan.NoiSinh;

            if (lh.KetHon.CanCuocCongDan1.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh1.Text = "Nam";
            else
                btGioiTinh1.Text = "Nữ";

            ThuongTru tt1 = ttDAO.LayThongTinThuongTruBangMaCD(lh.KetHon.CanCuocCongDan1.CongDan.MaCD);
            if (tt1 != null)
            {
                btThuongTru1.Text = tt1.MaHo.ToString();
                btTinhThanh1.Text = tt1.HoKhau.TinhThanh;
                btQuanHuyen1.Text = tt1.HoKhau.QuanHuyen;
                btPhuongXa1.Text = tt1.HoKhau.PhuongXa;
            }
            else
            {
                btThuongTru1.Text = "";
                btTinhThanh1.Text = "";
                btQuanHuyen1.Text = "";
                btPhuongXa1.Text = "";
            }
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

        private void fGiayLyHon_Load(object sender, EventArgs e)
        {
            LoadThongTin();
        }

        private void printDocument1_PrintPage(object sender, System.Drawing.Printing.PrintPageEventArgs e)
        {
            e.Graphics.DrawImage(bitmap, 0, 0);
        }
    }
}
