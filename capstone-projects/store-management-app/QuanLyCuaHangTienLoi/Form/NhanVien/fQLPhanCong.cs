using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    public partial class fQLPhanCong : Form
    {
        NhanVien nv = new NhanVien();
        PhanCongDAO pcDAO = new PhanCongDAO();
        CaDAO caDAO = new CaDAO();
        ChamCongDAO ccDAO = new ChamCongDAO();
        NgayLeDAO ngayLeDAO = new NgayLeDAO();
        int login;
        System.Timers.Timer t;
        int h, m, s;

        public fQLPhanCong(NhanVien nv, int login)
        {
            InitializeComponent();
            this.nv = nv;
            this.login = login;
        }

        void LoadDanhSach()
        {
            if (login == 1)
                dtgvPhanCong.DataSource = pcDAO.LayDanhSach();
            else
                dtgvPhanCong.DataSource = pcDAO.LayDanhSach(nv.MaNV);
        }

        private void fPhanCong_Load(object sender, EventArgs e)
        {
            LoadDanhSach();

            dtgvNgayLe.DataSource = ngayLeDAO.LayDanhSach();

            if (login == 0)
            {
                btThemNL.Visible = false;
                btSuaNL.Visible = false;
                btXoaNL.Visible = false;
                panel21.Visible = false;
            }    

            tbMaNV.Text = nv.MaNV;
            cbMaCa.DataSource = caDAO.LayDanhSach();
            cbMaCa.ValueMember = "MaCa";

            t = new System.Timers.Timer();
            t.Interval = 1000;
            t.Elapsed += OnTimeEvent;
            BatDauThoiGian();
        }

        void BatDauThoiGian()
        {
            h = DateTime.Now.Hour;
            m = DateTime.Now.Minute;
            s = DateTime.Now.Second;
            tbGioChamCong.Text = String.Format($"{h.ToString().PadLeft(2, '0')}:{m.ToString().PadLeft(2, '0')}:{s.ToString().PadLeft(2, '0')}");
            t.Start();
        }

        private void OnTimeEvent(object sender, ElapsedEventArgs e)
        {
            Invoke(new Action(() =>
            {
                s += 1;
                if (s == 60)
                {
                    s = 0;
                    m += 1;
                }
                if (m == 60)
                {
                    m = 0;
                    h += 1;
                }
                tbGioChamCong.Text = String.Format($"{h.ToString().PadLeft(2,'0')}:{m.ToString().PadLeft(2, '0')}:{s.ToString().PadLeft(2, '0')}");
            }));
        }

        private void btDangKy_Click(object sender, EventArgs e)
        {
            PhanCong pc = new PhanCong(0, tbMaNV.Text, cbMaCa.Text, dtpkNgayDK.Value);
            pcDAO.Them(pc);
            LoadDanhSach();
        }

        private void cbMaCa_TextChanged(object sender, EventArgs e)
        {
            Ca ca = caDAO.LayThongTinCaBangMaCa(cbMaCa.Text);
            if (ca != null)
            {
                tbGioBatDau.Text = ca.GioBatDau.ToString();
                tbGioKetThuc.Text = ca.GioKetThuc.ToString();
            }
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            PhanCong pc = new PhanCong(Convert.ToInt32(tbMaPC.Text), tbMaNV.Text, cbMaCa.Text, DateTime.Today);
            pcDAO.Xoa(pc);
            LoadDanhSach();
        }

        private void dtgvPhanCong_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvPhanCong.CurrentRow.Selected = true;
            this.tbMaPC.Text = dtgvPhanCong.SelectedRows[0].Cells[0].Value.ToString();
            this.cbMaCa.Text = dtgvPhanCong.SelectedRows[0].Cells[3].Value.ToString();
            this.dtpkNgayDK.Value = (DateTime)dtgvPhanCong.SelectedRows[0].Cells[6].Value;
            this.dtpkNgayChamCong.Value = (DateTime)dtgvPhanCong.SelectedRows[0].Cells[6].Value;

            dtgvChamCong.DataSource = ccDAO.LayDanhSach(Convert.ToInt32(tbMaPC.Text));
        }

        private void tbGioChamCong_MouseDown(object sender, MouseEventArgs e)
        {
            t.Stop();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            BatDauThoiGian();
        }

        private void btThemNL_Click(object sender, EventArgs e)
        {
            NgayLe nl = new NgayLe(0, dtpkNL.Value, tbSuKien.Text);
            ngayLeDAO.Them(nl);
            tbSuKien.Text = "";
            tbMaNL.Text = "";
            dtpkNL.Value = DateTime.Today;
            dtgvNgayLe.DataSource = ngayLeDAO.LayDanhSach();
        }

        private void btSuaNL_Click(object sender, EventArgs e)
        {
            NgayLe nl = new NgayLe(Convert.ToInt32(tbMaNL.Text), dtpkNL.Value, tbSuKien.Text);
            ngayLeDAO.Sua(nl);
            tbSuKien.Text = "";
            tbMaNL.Text = "";
            dtpkNL.Value = DateTime.Today;
            dtgvNgayLe.DataSource = ngayLeDAO.LayDanhSach();
        }

        private void btXoaNL_Click(object sender, EventArgs e)
        {
            NgayLe nl = new NgayLe(Convert.ToInt32(tbMaNL.Text), dtpkNL.Value, tbSuKien.Text);
            ngayLeDAO.Xoa(nl);
            tbSuKien.Text = "";
            tbMaNL.Text = "";
            dtpkNL.Value = DateTime.Today;
            dtgvNgayLe.DataSource = ngayLeDAO.LayDanhSach();
        }

        private void dtgvNgayLe_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvNgayLe.CurrentRow.Selected = true;
            this.tbMaNL.Text = dtgvNgayLe.SelectedRows[0].Cells[0].Value.ToString();
            this.dtpkNL.Value = (DateTime)dtgvNgayLe.SelectedRows[0].Cells[1].Value;
            this.tbSuKien.Text = dtgvNgayLe.SelectedRows[0].Cells[2].Value.ToString();
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvPhanCong.DataSource = pcDAO.TimKiem(tbTimKiem.Text);
        }

        private void btCheckIn_Click(object sender, EventArgs e)
        {
            try
            {
                ChamCong cc = new ChamCong(Convert.ToInt32(tbMaPC.Text), TimeSpan.Parse(tbGioChamCong.Text), null, null);
                ccDAO.CheckIn(cc);
                dtgvChamCong.DataSource = ccDAO.LayDanhSach(cc.MaPC);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Check out thất bại!\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btCheckOut_Click(object sender, EventArgs e)
        {
            try
            {
                ChamCong cc = new ChamCong(Convert.ToInt32(tbMaPC.Text), null, TimeSpan.Parse(tbGioChamCong.Text), null);

                dtgvChamCong.CurrentRow.Selected = true;
                if (dtgvChamCong.SelectedRows[0].Cells[1].Value.ToString() != "" && dtgvChamCong.SelectedRows[0].Cells[2].Value.ToString() == "")
                {
                    ccDAO.CheckOut(cc);
                    dtgvChamCong.DataSource = ccDAO.LayDanhSach(cc.MaPC);
                }
                else
                    throw new Exception();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Check out thất bại!\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
