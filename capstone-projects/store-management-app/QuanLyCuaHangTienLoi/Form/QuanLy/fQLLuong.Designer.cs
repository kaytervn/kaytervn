namespace QuanLyCuaHangTienLoi
{
    partial class fQLLuong
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            this.dtgvTinhLuong = new System.Windows.Forms.DataGridView();
            this.maNVDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ngayDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tongLuongDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tinhLuongBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.tinhLuongDS = new QuanLyCuaHangTienLoi.TinhLuongDS();
            this.tinhLuongTableAdapter = new QuanLyCuaHangTienLoi.TinhLuongDSTableAdapters.TinhLuongTableAdapter();
            this.panel10 = new System.Windows.Forms.Panel();
            this.ptHinh = new System.Windows.Forms.PictureBox();
            this.panel6 = new System.Windows.Forms.Panel();
            this.chbTrangThai = new System.Windows.Forms.CheckBox();
            this.panel4 = new System.Windows.Forms.Panel();
            this.tbMatKhau = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.panel3 = new System.Windows.Forms.Panel();
            this.dtpkNgaySinh = new System.Windows.Forms.DateTimePicker();
            this.label2 = new System.Windows.Forms.Label();
            this.panel7 = new System.Windows.Forms.Panel();
            this.tbEmail = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.panel8 = new System.Windows.Forms.Panel();
            this.tbTenCV = new System.Windows.Forms.TextBox();
            this.label8 = new System.Windows.Forms.Label();
            this.panel9 = new System.Windows.Forms.Panel();
            this.tbTenTK = new System.Windows.Forms.TextBox();
            this.label9 = new System.Windows.Forms.Label();
            this.panel5 = new System.Windows.Forms.Panel();
            this.chbPhai = new System.Windows.Forms.CheckBox();
            this.tbSDT = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.tbTenNV = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.cbMaNV = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.btXemTatCa = new System.Windows.Forms.Button();
            this.panel11 = new System.Windows.Forms.Panel();
            this.label6 = new System.Windows.Forms.Label();
            this.tbTongLuong = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.dtgvTinhLuong)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.tinhLuongBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.tinhLuongDS)).BeginInit();
            this.panel10.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ptHinh)).BeginInit();
            this.panel6.SuspendLayout();
            this.panel4.SuspendLayout();
            this.panel3.SuspendLayout();
            this.panel7.SuspendLayout();
            this.panel8.SuspendLayout();
            this.panel9.SuspendLayout();
            this.panel5.SuspendLayout();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.panel11.SuspendLayout();
            this.SuspendLayout();
            // 
            // dtgvTinhLuong
            // 
            this.dtgvTinhLuong.AllowUserToAddRows = false;
            this.dtgvTinhLuong.AllowUserToDeleteRows = false;
            this.dtgvTinhLuong.AllowUserToResizeColumns = false;
            this.dtgvTinhLuong.AllowUserToResizeRows = false;
            this.dtgvTinhLuong.AutoGenerateColumns = false;
            this.dtgvTinhLuong.BackgroundColor = System.Drawing.SystemColors.ButtonHighlight;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dtgvTinhLuong.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.dtgvTinhLuong.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dtgvTinhLuong.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.maNVDataGridViewTextBoxColumn,
            this.ngayDataGridViewTextBoxColumn,
            this.tongLuongDataGridViewTextBoxColumn});
            this.dtgvTinhLuong.DataSource = this.tinhLuongBindingSource;
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = System.Drawing.SystemColors.Window;
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle2.ForeColor = System.Drawing.SystemColors.ControlText;
            dataGridViewCellStyle2.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle2.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.dtgvTinhLuong.DefaultCellStyle = dataGridViewCellStyle2;
            this.dtgvTinhLuong.GridColor = System.Drawing.SystemColors.ActiveBorder;
            this.dtgvTinhLuong.Location = new System.Drawing.Point(11, 311);
            this.dtgvTinhLuong.Margin = new System.Windows.Forms.Padding(2);
            this.dtgvTinhLuong.Name = "dtgvTinhLuong";
            this.dtgvTinhLuong.ReadOnly = true;
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Times New Roman", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle3.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle3.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle3.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dtgvTinhLuong.RowHeadersDefaultCellStyle = dataGridViewCellStyle3;
            this.dtgvTinhLuong.RowHeadersWidth = 51;
            this.dtgvTinhLuong.RowTemplate.Height = 24;
            this.dtgvTinhLuong.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dtgvTinhLuong.Size = new System.Drawing.Size(1500, 486);
            this.dtgvTinhLuong.TabIndex = 78;
            this.dtgvTinhLuong.DataSourceChanged += new System.EventHandler(this.dtgvTinhLuong_DataSourceChanged);
            // 
            // maNVDataGridViewTextBoxColumn
            // 
            this.maNVDataGridViewTextBoxColumn.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.maNVDataGridViewTextBoxColumn.DataPropertyName = "MaNV";
            this.maNVDataGridViewTextBoxColumn.HeaderText = "Mã nhân viên";
            this.maNVDataGridViewTextBoxColumn.Name = "maNVDataGridViewTextBoxColumn";
            this.maNVDataGridViewTextBoxColumn.ReadOnly = true;
            // 
            // ngayDataGridViewTextBoxColumn
            // 
            this.ngayDataGridViewTextBoxColumn.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.ngayDataGridViewTextBoxColumn.DataPropertyName = "Ngay";
            this.ngayDataGridViewTextBoxColumn.HeaderText = "Ngày";
            this.ngayDataGridViewTextBoxColumn.Name = "ngayDataGridViewTextBoxColumn";
            this.ngayDataGridViewTextBoxColumn.ReadOnly = true;
            // 
            // tongLuongDataGridViewTextBoxColumn
            // 
            this.tongLuongDataGridViewTextBoxColumn.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.tongLuongDataGridViewTextBoxColumn.DataPropertyName = "TongLuong";
            this.tongLuongDataGridViewTextBoxColumn.HeaderText = "Tổng lương";
            this.tongLuongDataGridViewTextBoxColumn.Name = "tongLuongDataGridViewTextBoxColumn";
            this.tongLuongDataGridViewTextBoxColumn.ReadOnly = true;
            // 
            // tinhLuongBindingSource
            // 
            this.tinhLuongBindingSource.DataMember = "TinhLuong";
            this.tinhLuongBindingSource.DataSource = this.tinhLuongDS;
            // 
            // tinhLuongDS
            // 
            this.tinhLuongDS.DataSetName = "TinhLuongDS";
            this.tinhLuongDS.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
            // 
            // tinhLuongTableAdapter
            // 
            this.tinhLuongTableAdapter.ClearBeforeFill = true;
            // 
            // panel10
            // 
            this.panel10.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(232)))), ((int)(((byte)(254)))));
            this.panel10.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.panel10.Controls.Add(this.ptHinh);
            this.panel10.Controls.Add(this.panel6);
            this.panel10.Controls.Add(this.panel4);
            this.panel10.Controls.Add(this.panel3);
            this.panel10.Controls.Add(this.panel7);
            this.panel10.Controls.Add(this.panel8);
            this.panel10.Controls.Add(this.panel9);
            this.panel10.Controls.Add(this.panel5);
            this.panel10.Controls.Add(this.panel1);
            this.panel10.Controls.Add(this.panel2);
            this.panel10.Location = new System.Drawing.Point(12, 50);
            this.panel10.Name = "panel10";
            this.panel10.Size = new System.Drawing.Size(1499, 246);
            this.panel10.TabIndex = 79;
            // 
            // ptHinh
            // 
            this.ptHinh.BackColor = System.Drawing.Color.White;
            this.ptHinh.Location = new System.Drawing.Point(1150, 21);
            this.ptHinh.Name = "ptHinh";
            this.ptHinh.Size = new System.Drawing.Size(216, 196);
            this.ptHinh.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.ptHinh.TabIndex = 41;
            this.ptHinh.TabStop = false;
            // 
            // panel6
            // 
            this.panel6.BackColor = System.Drawing.Color.White;
            this.panel6.Controls.Add(this.chbTrangThai);
            this.panel6.Location = new System.Drawing.Point(588, 58);
            this.panel6.Margin = new System.Windows.Forms.Padding(2);
            this.panel6.Name = "panel6";
            this.panel6.Size = new System.Drawing.Size(213, 40);
            this.panel6.TabIndex = 40;
            // 
            // chbTrangThai
            // 
            this.chbTrangThai.BackColor = System.Drawing.Color.Transparent;
            this.chbTrangThai.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.chbTrangThai.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(224)))), ((int)(((byte)(192)))));
            this.chbTrangThai.FlatAppearance.BorderSize = 2;
            this.chbTrangThai.FlatAppearance.CheckedBackColor = System.Drawing.Color.Red;
            this.chbTrangThai.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.chbTrangThai.Location = new System.Drawing.Point(3, 8);
            this.chbTrangThai.Name = "chbTrangThai";
            this.chbTrangThai.Size = new System.Drawing.Size(163, 25);
            this.chbTrangThai.TabIndex = 1;
            this.chbTrangThai.Text = "Còn làm việc";
            this.chbTrangThai.UseVisualStyleBackColor = false;
            // 
            // panel4
            // 
            this.panel4.BackColor = System.Drawing.Color.White;
            this.panel4.Controls.Add(this.tbMatKhau);
            this.panel4.Controls.Add(this.label4);
            this.panel4.Location = new System.Drawing.Point(588, 146);
            this.panel4.Margin = new System.Windows.Forms.Padding(2);
            this.panel4.Name = "panel4";
            this.panel4.Size = new System.Drawing.Size(503, 40);
            this.panel4.TabIndex = 2;
            // 
            // tbMatKhau
            // 
            this.tbMatKhau.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbMatKhau.Location = new System.Drawing.Point(95, 7);
            this.tbMatKhau.Margin = new System.Windows.Forms.Padding(2);
            this.tbMatKhau.Name = "tbMatKhau";
            this.tbMatKhau.ReadOnly = true;
            this.tbMatKhau.Size = new System.Drawing.Size(394, 26);
            this.tbMatKhau.TabIndex = 1;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(3, 10);
            this.label4.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(83, 19);
            this.label4.TabIndex = 0;
            this.label4.Text = "Mật Khẩu:";
            // 
            // panel3
            // 
            this.panel3.BackColor = System.Drawing.Color.White;
            this.panel3.Controls.Add(this.dtpkNgaySinh);
            this.panel3.Controls.Add(this.label2);
            this.panel3.Location = new System.Drawing.Point(15, 146);
            this.panel3.Margin = new System.Windows.Forms.Padding(2);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(503, 40);
            this.panel3.TabIndex = 37;
            // 
            // dtpkNgaySinh
            // 
            this.dtpkNgaySinh.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dtpkNgaySinh.Location = new System.Drawing.Point(96, 10);
            this.dtpkNgaySinh.Name = "dtpkNgaySinh";
            this.dtpkNgaySinh.Size = new System.Drawing.Size(393, 26);
            this.dtpkNgaySinh.TabIndex = 35;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(3, 10);
            this.label2.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(83, 19);
            this.label2.TabIndex = 0;
            this.label2.Text = "Ngày Sinh:";
            // 
            // panel7
            // 
            this.panel7.BackColor = System.Drawing.Color.White;
            this.panel7.Controls.Add(this.tbEmail);
            this.panel7.Controls.Add(this.label7);
            this.panel7.Location = new System.Drawing.Point(15, 190);
            this.panel7.Margin = new System.Windows.Forms.Padding(2);
            this.panel7.Name = "panel7";
            this.panel7.Size = new System.Drawing.Size(503, 40);
            this.panel7.TabIndex = 36;
            // 
            // tbEmail
            // 
            this.tbEmail.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbEmail.Location = new System.Drawing.Point(95, 7);
            this.tbEmail.Margin = new System.Windows.Forms.Padding(2);
            this.tbEmail.Name = "tbEmail";
            this.tbEmail.ReadOnly = true;
            this.tbEmail.Size = new System.Drawing.Size(394, 26);
            this.tbEmail.TabIndex = 1;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label7.Location = new System.Drawing.Point(3, 10);
            this.label7.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(47, 19);
            this.label7.TabIndex = 0;
            this.label7.Text = "Email";
            // 
            // panel8
            // 
            this.panel8.BackColor = System.Drawing.Color.White;
            this.panel8.Controls.Add(this.tbTenCV);
            this.panel8.Controls.Add(this.label8);
            this.panel8.Location = new System.Drawing.Point(588, 14);
            this.panel8.Margin = new System.Windows.Forms.Padding(2);
            this.panel8.Name = "panel8";
            this.panel8.Size = new System.Drawing.Size(503, 40);
            this.panel8.TabIndex = 38;
            // 
            // tbTenCV
            // 
            this.tbTenCV.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbTenCV.Location = new System.Drawing.Point(95, 7);
            this.tbTenCV.Margin = new System.Windows.Forms.Padding(2);
            this.tbTenCV.Name = "tbTenCV";
            this.tbTenCV.ReadOnly = true;
            this.tbTenCV.Size = new System.Drawing.Size(394, 26);
            this.tbTenCV.TabIndex = 1;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label8.Location = new System.Drawing.Point(3, 10);
            this.label8.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(65, 19);
            this.label8.TabIndex = 0;
            this.label8.Text = "Tên CV:";
            // 
            // panel9
            // 
            this.panel9.BackColor = System.Drawing.Color.White;
            this.panel9.Controls.Add(this.tbTenTK);
            this.panel9.Controls.Add(this.label9);
            this.panel9.Location = new System.Drawing.Point(588, 102);
            this.panel9.Margin = new System.Windows.Forms.Padding(2);
            this.panel9.Name = "panel9";
            this.panel9.Size = new System.Drawing.Size(503, 40);
            this.panel9.TabIndex = 2;
            // 
            // tbTenTK
            // 
            this.tbTenTK.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbTenTK.Location = new System.Drawing.Point(96, 7);
            this.tbTenTK.Margin = new System.Windows.Forms.Padding(2);
            this.tbTenTK.Name = "tbTenTK";
            this.tbTenTK.ReadOnly = true;
            this.tbTenTK.Size = new System.Drawing.Size(394, 26);
            this.tbTenTK.TabIndex = 1;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label9.Location = new System.Drawing.Point(3, 10);
            this.label9.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(66, 19);
            this.label9.TabIndex = 0;
            this.label9.Text = "Tên TK:";
            // 
            // panel5
            // 
            this.panel5.BackColor = System.Drawing.Color.White;
            this.panel5.Controls.Add(this.chbPhai);
            this.panel5.Controls.Add(this.tbSDT);
            this.panel5.Controls.Add(this.label5);
            this.panel5.Location = new System.Drawing.Point(15, 102);
            this.panel5.Margin = new System.Windows.Forms.Padding(2);
            this.panel5.Name = "panel5";
            this.panel5.Size = new System.Drawing.Size(503, 40);
            this.panel5.TabIndex = 36;
            // 
            // chbPhai
            // 
            this.chbPhai.BackColor = System.Drawing.Color.Transparent;
            this.chbPhai.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.chbPhai.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(224)))), ((int)(((byte)(192)))));
            this.chbPhai.FlatAppearance.BorderSize = 2;
            this.chbPhai.FlatAppearance.CheckedBackColor = System.Drawing.Color.Red;
            this.chbPhai.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.chbPhai.Location = new System.Drawing.Point(436, 8);
            this.chbPhai.Name = "chbPhai";
            this.chbPhai.Size = new System.Drawing.Size(53, 25);
            this.chbPhai.TabIndex = 1;
            this.chbPhai.Text = "Nữ";
            this.chbPhai.UseVisualStyleBackColor = false;
            // 
            // tbSDT
            // 
            this.tbSDT.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbSDT.Location = new System.Drawing.Point(95, 7);
            this.tbSDT.Margin = new System.Windows.Forms.Padding(2);
            this.tbSDT.Name = "tbSDT";
            this.tbSDT.ReadOnly = true;
            this.tbSDT.Size = new System.Drawing.Size(305, 26);
            this.tbSDT.TabIndex = 1;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(3, 10);
            this.label5.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(44, 19);
            this.label5.TabIndex = 0;
            this.label5.Text = "SĐT:";
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.tbTenNV);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Location = new System.Drawing.Point(15, 58);
            this.panel1.Margin = new System.Windows.Forms.Padding(2);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(503, 40);
            this.panel1.TabIndex = 2;
            // 
            // tbTenNV
            // 
            this.tbTenNV.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbTenNV.Location = new System.Drawing.Point(95, 7);
            this.tbTenNV.Margin = new System.Windows.Forms.Padding(2);
            this.tbTenNV.Name = "tbTenNV";
            this.tbTenNV.ReadOnly = true;
            this.tbTenNV.Size = new System.Drawing.Size(394, 26);
            this.tbTenNV.TabIndex = 36;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(3, 10);
            this.label3.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(40, 19);
            this.label3.TabIndex = 0;
            this.label3.Text = "Tên:";
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.White;
            this.panel2.Controls.Add(this.cbMaNV);
            this.panel2.Controls.Add(this.label1);
            this.panel2.Location = new System.Drawing.Point(15, 14);
            this.panel2.Margin = new System.Windows.Forms.Padding(2);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(503, 40);
            this.panel2.TabIndex = 0;
            // 
            // cbMaNV
            // 
            this.cbMaNV.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cbMaNV.FormattingEnabled = true;
            this.cbMaNV.Location = new System.Drawing.Point(96, 5);
            this.cbMaNV.Name = "cbMaNV";
            this.cbMaNV.Size = new System.Drawing.Size(393, 28);
            this.cbMaNV.TabIndex = 1;
            this.cbMaNV.TextChanged += new System.EventHandler(this.cbMaNV_TextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Times New Roman", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(3, 10);
            this.label1.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(64, 19);
            this.label1.TabIndex = 0;
            this.label1.Text = "Mã NV:";
            // 
            // btXemTatCa
            // 
            this.btXemTatCa.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btXemTatCa.Location = new System.Drawing.Point(12, 814);
            this.btXemTatCa.Name = "btXemTatCa";
            this.btXemTatCa.Size = new System.Drawing.Size(239, 49);
            this.btXemTatCa.TabIndex = 80;
            this.btXemTatCa.Text = "Xem tất cả";
            this.btXemTatCa.UseVisualStyleBackColor = true;
            this.btXemTatCa.Click += new System.EventHandler(this.btXemTatCa_Click);
            // 
            // panel11
            // 
            this.panel11.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(232)))), ((int)(((byte)(254)))));
            this.panel11.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.panel11.Controls.Add(this.label6);
            this.panel11.Controls.Add(this.tbTongLuong);
            this.panel11.Location = new System.Drawing.Point(464, 814);
            this.panel11.Name = "panel11";
            this.panel11.Size = new System.Drawing.Size(1047, 74);
            this.panel11.TabIndex = 83;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Times New Roman", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.ForeColor = System.Drawing.Color.Red;
            this.label6.Location = new System.Drawing.Point(16, 21);
            this.label6.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(157, 31);
            this.label6.TabIndex = 31;
            this.label6.Text = "Tổng lương:";
            // 
            // tbTongLuong
            // 
            this.tbTongLuong.BackColor = System.Drawing.Color.White;
            this.tbTongLuong.Font = new System.Drawing.Font("Times New Roman", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbTongLuong.ForeColor = System.Drawing.Color.Red;
            this.tbTongLuong.Location = new System.Drawing.Point(219, 19);
            this.tbTongLuong.Margin = new System.Windows.Forms.Padding(2);
            this.tbTongLuong.Name = "tbTongLuong";
            this.tbTongLuong.ReadOnly = true;
            this.tbTongLuong.Size = new System.Drawing.Size(799, 39);
            this.tbTongLuong.TabIndex = 32;
            // 
            // fQLLuong
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
            this.ClientSize = new System.Drawing.Size(1521, 895);
            this.Controls.Add(this.panel11);
            this.Controls.Add(this.btXemTatCa);
            this.Controls.Add(this.panel10);
            this.Controls.Add(this.dtgvTinhLuong);
            this.Name = "fQLLuong";
            this.Text = "fQLLuong";
            this.Load += new System.EventHandler(this.fQLLuong_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dtgvTinhLuong)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.tinhLuongBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.tinhLuongDS)).EndInit();
            this.panel10.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.ptHinh)).EndInit();
            this.panel6.ResumeLayout(false);
            this.panel4.ResumeLayout(false);
            this.panel4.PerformLayout();
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.panel7.ResumeLayout(false);
            this.panel7.PerformLayout();
            this.panel8.ResumeLayout(false);
            this.panel8.PerformLayout();
            this.panel9.ResumeLayout(false);
            this.panel9.PerformLayout();
            this.panel5.ResumeLayout(false);
            this.panel5.PerformLayout();
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.panel11.ResumeLayout(false);
            this.panel11.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.DataGridView dtgvTinhLuong;
        private TinhLuongDS tinhLuongDS;
        private System.Windows.Forms.BindingSource tinhLuongBindingSource;
        private TinhLuongDSTableAdapters.TinhLuongTableAdapter tinhLuongTableAdapter;
        private System.Windows.Forms.DataGridViewTextBoxColumn maNVDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn ngayDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn tongLuongDataGridViewTextBoxColumn;
        private System.Windows.Forms.Panel panel10;
        private System.Windows.Forms.PictureBox ptHinh;
        private System.Windows.Forms.Panel panel6;
        private System.Windows.Forms.CheckBox chbTrangThai;
        private System.Windows.Forms.Panel panel4;
        private System.Windows.Forms.TextBox tbMatKhau;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.DateTimePicker dtpkNgaySinh;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Panel panel7;
        private System.Windows.Forms.TextBox tbEmail;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Panel panel8;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Panel panel9;
        private System.Windows.Forms.TextBox tbTenTK;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Panel panel5;
        private System.Windows.Forms.CheckBox chbPhai;
        private System.Windows.Forms.TextBox tbSDT;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.TextBox tbTenNV;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button btXemTatCa;
        private System.Windows.Forms.TextBox tbTenCV;
        private System.Windows.Forms.ComboBox cbMaNV;
        private System.Windows.Forms.Panel panel11;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox tbTongLuong;
    }
}