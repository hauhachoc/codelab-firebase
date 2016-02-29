package com.gdg.firebase.nanochat;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import com.firebase.client.Firebase;
import com.firebase.ui.FirebaseListAdapter;

public class MainActivity extends AppCompatActivity {

    private Firebase mFirebaseRef;
    FirebaseListAdapter<ChatMessage> mListAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Firebase.setAndroidContext(this);
        mFirebaseRef = new Firebase("https://codelabg.firebaseio.com");

        final EditText textEdit = (EditText) this.findViewById(R.id.text_edit);
        Button sendButton = (Button) this.findViewById(R.id.send_button);

        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String text = textEdit.getText().toString();
                ChatMessage message = new ChatMessage("Android User", text);
                mFirebaseRef.push().setValue(message);
                textEdit.setText("");
            }
        });

        final ListView listView = (ListView) this.findViewById(android.R.id.list);
        mListAdapter = new FirebaseListAdapter<ChatMessage>(this, ChatMessage.class,
                android.R.layout.two_line_list_item, mFirebaseRef) {
            @Override
            protected void populateView(View v, ChatMessage model, int position) {
                ((TextView)v.findViewById(android.R.id.text1)).setText(model.getName());
                ((TextView)v.findViewById(android.R.id.text2)).setText(model.getText());
            }
        };
        listView.setAdapter(mListAdapter);
    }
}
