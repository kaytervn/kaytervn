#include<iostream>
#include<cmath>

void nhap(int A[], int &n);
bool ktSNT(int n);
int tongSNT(int A[], int nA, int B[], int &nB);
void xuatTong(int A[], int nA, int B[], int nB, int C[], int nC, int D[], int nD);
void xuatMangTrong();
void xuatSo(int n);
void xuatMang(int A[], int n);
int absMin(int A[], int nA, int C[], int nC);
int viTriMin(int A[], int n);
void mangABS(int A[], int nA, int C[], int &nC);
bool mangKhac0(int A[], int n);
bool checkTangDan(int n, int A[]);
void sapXepGiamDan(int A[], int nA, int B[], int &nB);

using namespace std;
int main()
{
	int nA, A[1000], nB, B[1000], nC, C[1000], nD, D[1000];
	nhap(A,nA);
	tongSNT(A,nA,B,nB);
	sapXepGiamDan(A,nA,D,nD);
	xuatTong(A,nA,B,nB,C,nC,D,nD);
	return 0;
}


void nhap(int A[], int &n)
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

void mangABS(int A[], int nA, int C[], int &nC)
{
	nC=0;
	for(int i=0;i<nA;i++)
			C[nC++]=abs(A[i]);
}

int absMin(int A[], int nA, int C[], int nC)
{
	int p=viTriMin(C,nC);
	int min=A[p];
	if(min==INT_MAX)
		min=0;
	return min;
}

int viTriMin(int A[], int n)
{
	int min=INT_MAX;
	int p=-1;
	for(int i=0;i<n;i++)
		if(A[i]<min && A[i]>0)
			{
				min=A[i];
				p=i;
			}
	return p;
}

bool ktSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
	{
		if(n%i == 0)
			return 0;
	}
	return 1;
}

int tongSNT(int A[], int nA, int B[], int &nB)
{
	int s=0;
	nB=0;
	for(int i=0;i<nA;i++)
		if(ktSNT(A[i])==1)
		{
			B[nB++]=A[i];
			s +=A[i];
		}
	return s;
}

bool checkTangDan(int n, int A[])
{
	for(int i=0;i<n-1;i++)
	{
		if(A[i]>A[i+1])
			return 0;
	}
	return 1;
}

void sapXepGiamDan(int A[], int nA, int B[], int &nB)
{
	int iA=0;
	nB=0;
	while(iA<nA)
		B[nB++]=A[iA++];
	int tg;
	for(int i = 0; i < nB - 1; i++)
		for(int j = i + 1; j < nB; j++)
			if(B[i] < B[j])
			{
				tg = B[i];
				B[i] = B[j];
				B[j] = tg;
			}
}

void xuatTong(int A[], int nA, int B[], int nB, int C[], int nC, int D[], int nD)
{
	if(nA==0)
		xuatMangTrong();
	//Dong 1: Xuat mang vua nhap
	else
	{
	xuatMang(A,nA);
	cout<<endl;
	
	//Dong 2: Xuat so nguyen to
	if(tongSNT(A,nA,B,nB)!=0)
		xuatMang(B,nB);
	else
		cout<<"KHONG CO";
	cout<<endl;
	
	//Dong 3: Xuat tong SNT
	cout<<tongSNT(A,nA,B,nB)<<endl;
	
	//Dong 4: ABS min khac 0
	mangABS(A,nA,C,nC);
	xuatSo(absMin(A,nA,C,nC));
	cout<<endl;
	
	//Dong 5: Check tang dan
	if(checkTangDan(nA,A)==1)
		cout<<"TANG";
	else
		cout<<"KHONG TANG";
	cout<<endl;
	
	//Dong 6: Xap sep giam dan
	xuatMang(D,nD);
	
	}
}

void xuatMangTrong()
{
	cout<<"KHONG CO"<<endl
	<<"KHONG CO"<<endl
	<<0<<endl
	<<"KHONG CO"<<endl
	<<"KHONG TANG"<<endl
	<<"KHONG CO";
}

void xuatSo(int n)
{
	if(n==0)
		cout<<"KHONG CO";
	else
		cout<<n;
}

void xuatMang(int A[], int n)
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
