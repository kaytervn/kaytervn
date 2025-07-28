#include<bits/stdc++.h>
 
using namespace std;
 
int main(){
	string s;
	getline(cin, s);
 
	string result = "";
 
	for (int i=0;i<s.size();i++){
		if ('a'<=s[i] && s[i]<='z') continue;
		else if ('A'<=s[i] && s[i]<='Z') continue;
		s[i]=' ';
	}
 
	for (int i=0;i<s.size();i++){
		if ('a'<=s[i] && s[i]<='z') result+=s[i];
		else if ('A'<=s[i] && s[i]<='Z') result += (char)(s[i]+32);
		else if (s[i]==' '){
			if (result.size()==0) continue;
			else if (result[result.size()-1]!=' ') result+=s[i];
		}
	}

	//Viet hoa chu dau
	for (int i=0;i<result.size();i++){
		if (i==0) result[i] = (char)(result[i]-32);
		else if (result[i-1]==' ') result[i]=(char)(result[i]-32);
	}
 
	if (result[result.size()-1]==' ') result[result.size()-1]='\0';
 
	cout<<result;
}
