#include<bits/stdc++.h>
#include<fstream>
using namespace std;

struct DS{
	char name[51];
	char MSSV[4];
	double diem;
};

void docDS(DS &A, fstream &input);
void docFile(DS A[], int &n);
void xuat1SV(DS A);
void xuatDS(DS A[], int n);
int timMax(DS A[], int n);
int timMin(DS A[], int n);
void loaiSVduoi5(DS A[], int &n);
void xoaPos(DS A[], int &n, int pos);

int main()
{
	DS A[50];
	int n;
	docFile(A,n);
	
	cout<<"\t\tDANH SACH SV BAN DAU: \n\n";
	xuatDS(A,n);
	cout<<"\t\t   ***===****===***===***===***\n\n";
	
	loaiSVduoi5(A,n);
	
	//Doi cho SV co diem cao nhat dung dau DS, SV co diem thap nhat dung cuoi DS
	int maxd=timMax(A,n);
	swap(A[maxd], A[0]);
	int mind=timMin(A,n);
	swap(A[mind], A[n-1]);
	
	cout<<"\t\tDANH SACH SV SAU KHI DA THUC HIEN: \n\n"
	<<"\t1. Loai SV co diem CTDLGT duoi 5.0 ra khoi DS.\n"
	<<"\t2. SV co diem CTDLGT cao nhat dung dau DS.\n"
	<<"\t3. SV co diem CTDLGT thap nhat dung cuoi DS.\n\n";
	xuatDS(A,n);
	return 0;
}

void loaiSVduoi5(DS A[], int &n)
{
	int i=n-1;
	while(i>=0)
	{
		if(A[i].diem<5)
			xoaPos(A,n,i);
		i--;
	}
}

void xoaPos(DS A[], int &n, int pos)
{
	for(int i=pos;i<n-1;i++)
		A[i]=A[i+1];
	n--;
}

int timMax(DS A[], int n)
{
	double max=A[0].diem;
	int vt=0;
	for(int i=1;i<n;i++)
	{
		if(A[i].diem>max)
		{
			max=A[i].diem;
			vt=i;
		}
	}
	return vt;
}

int timMin(DS A[], int n)
{
	double min=A[0].diem;
	int vt=0;
	for(int i=1;i<n;i++)
	{
		if(A[i].diem<min)
		{
			min=A[i].diem;
			vt=i;
		}
	}
	return vt;
}

void xuatDS(DS A[], int n)
{
	for(int i=0;i<n;i++)
	{
		cout<<"STT: "<<i+1<<endl;
		xuat1SV(A[i]);
	}
}

void xuat1SV(DS A)
{
	cout<<"Ten SV: "<<A.name
	<<"\nMSSV: "<<A.MSSV
	<<"\nDiem mon CTDLGT: "<<A.diem<<endl<<endl;
}

void docFile(DS A[], int &n)
{
	fstream input;
	input.open("DANHSACH.txt", ios::in);
	
	if(input!=NULL)
	{
		input>>n;
		
		for(int i=0;i<n;i++)
		{
			docDS(A[i],input);
		}
		input.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void docDS(DS &A, fstream &input)
{
	input.ignore();
	input.getline(A.name,51);
	input.getline(A.MSSV,4);
	input>>A.diem;
}
