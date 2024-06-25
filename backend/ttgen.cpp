#include <bits/stdc++.h>
using namespace std;
#define int long long
#define uint unsigned long long
#define float long double
#define double long double
#define endl '\n'
#define yes cout<<"YES\n"
#define no cout<<"NO\n"
#define f(i,a,b) for(int i = a; i <= b; i++)
#define fr(i,a,b) for(int i = a; i >= b; i--)
#define all(x) x.begin(),x.end()
#define sz(x) ((int)(x).size())
#define vec vector<int>
#define dvec vector<vector<int>>
#define pb push_back
//************Nitin1605************

chrono::high_resolution_clock::time_point startTime;
bool genTable(int cl,vector<vector<int>> &table,vector<int> &b)
{
    chrono::high_resolution_clock::time_point endTime = chrono::high_resolution_clock::now();
    double durationInSeconds = chrono::duration_cast<chrono::seconds>(endTime - startTime).count();

    if (durationInSeconds > 10.0) return false;

    sort(all(table[cl]));
    int n=table[cl].size();
    do
    {
        bool free=true;
        fr(i,cl-1,0)
        {
            f(j,0,n-1)
            {
                if(j<table[i].size())
                {
                    if(b[table[i][j]]==b[table[cl][j]])free=false;
                }
                if(j-1<table[i].size() && j>=0)
                {
                    if(b[table[i][j-1]]==b[table[cl][j]])free=false;
                }
                if(j+1<table[i].size())
                {
                    if(b[table[i][j+1]]==b[table[cl][j]])free=false;
                }
            }
        }
        if(free==true)
        {
            if(cl+1==table.size())return true;
            int ans = genTable(cl+1,table,b);
            if(ans==true)return true;
        }
    } while (next_permutation(table[cl].begin(),table[cl].end()));
    return false;
}
int32_t main()
{
    startTime = chrono::high_resolution_clock::now();
    ios_base::sync_with_stdio(false);cin.tie(0),cout.tie(0);
    cout << fixed << setprecision(0);
    // #ifndef ONLINE_JUDGE
    freopen("input.txt", "r", stdin);
    freopen("timetable.csv", "w", stdout);
    // #endif
    int np;
    // cout << "Enter Number of Professors : ";
    cin >> np;
    // cout << "Enter Professors ids : ";
    vector<string> p(np+1);
    map<string,int> pind;
    f(i,1,np)cin >> p[i],pind[p[i]]=i;

    
    int nc;
    // cout << "Enter Number of Courses : ";
    cin >> nc;
    // cout << "Enter Course ids : ";
    vector<string> c(nc+1);
    map<string,int> cind;
    f(i,1,nc)cin >> c[i],cind[c[i]]=i;


    vector<vector<int>> cp(nc+1);
    map<int,vector<int>> g;

    f(i,1,nc)
    {
        // cout << "Number of professors in " << c[i] << " : ";
        int nx;
        cin >> nx;
        cp[i]=vector<int> (nx+1);
        f(j,1,nx)
        {
            string x;
            cin >> x;
            if(pind.count(x))
            {
                cp[i][j]=pind[x];
                g[i].push_back(pind[x]*-1);
                g[pind[x]*-1].push_back(i);
            }
            else 
            {
                j--;
                cout << "Renter as " << x << " doesnt exist\n";
            }
        }
    }

    // cout << g.size() << endl;
    // for(auto i:g)
    // {
    //     for(auto j:i.second)cout << i.first << " " << j << endl;
    // }

    map<int,int> vis;
    vector<int> b(nc+1);
    queue<int> q;
    int indg=0;
    f(i,1,nc)
    {
        if(vis[i]==1)continue;
        indg++;
        q.push(i);
        while(q.size())
        {
            int cur=q.front();q.pop();
            if(cur>0)b[cur]=indg;
            for(auto j:g[cur])
            {
                if(vis[j]==1)continue;
                q.push(j);vis[j]=1;
            }
        }
    }

    int ny;
    cin >> ny;
    vector<vector<int>> table(ny);
    vector<string> y(ny);
    map<string,int> yind;
    f(i,0,ny-1)
    {
        cin >> y[i];
        yind[y[i]]=i;
        int nx;
        cin >> nx;
        table[i]=vector<int> (nx);
        f(j,0,nx-1)
        {
            string x;
            cin >> x;
            if(cind.count(x))
            {
                table[i][j]=cind[x];
            }
            else 
            {
                j--;
                cout << "Renter as " << x << " doesnt exist\n";
            }
        }
    }
    sort(table.begin(), table.end(), [](const vector<int> & a, const vector<int> & b){ return a.size() < b.size(); });
    for(auto &i:table)sort(all(i));
    // for(auto &i:table)for(auto j:i)cout << j << " ";cout << endl;
    vector<vector<bool>> bd(((int)table[ny-1].size()),vector<bool> (indg+1,false));
    bool ans = genTable(0,table,b);
    if(ans==false)
    {
        cout << "Impossible";
        return 0;
    }
    f(i,0,5)
    {
        cout << "\"";
        if(i)cout << "Class " << i;
        cout << "\"";
        cout << ",";
    }cout << endl;
    f(i,0,ny-1)
    {
        cout << "\"";
        cout << y[i];
        cout << "\",";
        for(auto j:table[i])
        {
            cout << "\"";
            cout << c[j] << "\n";
            cout << "( ";
            int kn=cp[j].size();
            f(k,1,kn-1)
            {
                if(k>1)cout << ", ";
                cout << p[cp[j][k]];
            }
            cout << " )";
            cout << "\"";
            cout << ",";
        }
        cout << endl;
    }
}
