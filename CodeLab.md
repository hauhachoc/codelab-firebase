
###Step 2.1: Thêm thư viện Firebase và Google Play Service (cho login)
````Groovy
apply plugin: 'com.android.application'

android {
    compileSdkVersion 23
    buildToolsVersion "23.0.2"

    defaultConfig {
        applicationId "codelab.gdg.nanochat"
        minSdkVersion 16
        targetSdkVersion 23
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
    packagingOptions {
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE-FIREBASE.txt'
        exclude 'META-INF/NOTICE'
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    testCompile 'junit:junit:4.12'

    compile 'com.google.android.gms:play-services-auth:8.4.0'
    compile 'com.android.support:appcompat-v7:23.1.1'
    compile 'com.firebase:firebase-client-android:2.5.0'
    compile 'com.firebaseui:firebase-ui:0.3.1'
}
````
###Step 2.2: Thêm INTERNET permission
````xml
<uses-permission android:name="android.permission.INTERNET"/>
````
###Step 2.3: Khởi tạo Firebase context.
###Step 2.4: Tạo kết nối tới database trên FirebaseIO.com
````Java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Firebase.setAndroidContext(this);
    mFirebaseRef = new Firebase("https://codelabg.firebaseio.com");
}
````
###Step 3.1: Gửi message: giao diện.
````xml
<LinearLayout
    android:id="@+id/footer"
    android:layout_alignParentBottom="true"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">
    <EditText
        android:id="@+id/text_edit"
        android:layout_width="0dp"
        android:layout_weight="1"
        android:layout_height="wrap_content"
        android:singleLine="true"
        android:inputType="textShortMessage" />
    <Button
        android:id="@+id/send_button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Send" />
</LinearLayout>
````
###Step 3.2: thêm view controller để gửi message.
````Java
Firebase.setAndroidContext(this);
mFirebaseRef = new Firebase("https://codelabg.firebaseio.com");

final EditText textEdit = (EditText) this.findViewById(R.id.text_edit);
Button sendButton = (Button) this.findViewById(R.id.send_button);

sendButton.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        String text = textEdit.getText().toString();
        Map<String,Object> values = new HashMap<>();
        values.put("name", "Android User");
        values.put("text", text);
        mFirebaseRef.push().setValue(values);
        textEdit.setText("");
    }
});
````
###Step 4.1: Thêm ChatMessage model.
````Java
public class ChatMessage {
  private String name;
  private String text;
  
  public ChatMessage() {
      // dùng cho Firebase's deserializer
  }
}
````
###Step 4.2: Thêm ListView để hiện thị message.
````xml
tools:context="codelab.gdg.nanochat.MainActivity">

<ListView
    android:id="@android:id/list"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:layout_above="@+id/footer"/>

<LinearLayout
    android:id="@+id/footer"
````
###Step 4.3: Thêm ListView trong code và set Adapter
````Java
final ListView listView = (ListView) this.findViewById(android.R.id.list);
mListAdapter = new FirebaseListAdapter<ChatMessage>(this, ChatMessage.class,
        android.R.layout.two_line_list_item, mFirebaseRef) {
    @Override
    protected void populateView(View v, ChatMessage model, int position) {
        ((TextView) v.findViewById(android.R.id.text1)).setText(model.getName());
        ((TextView) v.findViewById(android.R.id.text2)).setText(model.getText());
    }
};
listView.setAdapter(mListAdapter);
````
###Step 4.5: Đóng kết nối sau khi thoát app.
````Java
@Override
protected void onDestroy() {
    super.onDestroy();
    mListAdapter.cleanup();
}
````
###Step 5.2: Thêm button Login: file xml
````xml
<ListView
  android:id="@android:id/list"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:layout_above="@+id/footer"/>

<Button
  android:layout_width="wrap_content"
  android:layout_height="wrap_content"
  android:text="Login"
  android:id="@+id/login"
  android:layout_alignTop="@android:id/list"
  android:layout_alignRight="@android:id/list"
  android:layout_alignEnd="@android:id/list" />

<LinearLayout
  android:id="@+id/footer"
````
###Step 5.3: Sử dụng FirebaseLoginBaseActivity để dùng Firebase Login dialog
````Java
public class MainActivity extends FirebaseLoginBaseActivity {
````
###Step 5.4: Sử dụng mFirebaseRef cho FirebaseLoginBaseActivity
````Java
@Override
protected Firebase getFirebaseRef() {
    return mFirebaseRef;
}
````
###Step 5.5: Sử dụng Login PASSWORD ở client.
````Java
@Override
protected void onStart() {
    super.onStart();
    setEnabledAuthProvider(AuthProviderType.PASSWORD);
}
````
###Step 5.6: Mở login dialog khi loginButton được chọn. 
````Java
Button loginButton = (Button) this.findViewById(R.id.login);
loginButton.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        showFirebaseLoginPrompt();
    }
});
````
#Step 5.7: Hiển thị thông tin user
````Java
sendButton.setOnClickListener(new View.OnClickListener() {
  @Override
  public void onClick(View v) {
      String text = textEdit.getText().toString();
      ChatMessage message = new ChatMessage(mFirebaseRef.getAuth()
          .getProviderData().get("email").toString(), text);
      mFirebaseRef.push().setValue(message);
      textEdit.setText("");
  }
});
````
