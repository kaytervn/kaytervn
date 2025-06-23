package com.finance.ui.chat.adapter;

import android.content.Context;
import android.widget.ArrayAdapter;

import java.util.List;

public class CustomArrayAdapter extends ArrayAdapter<String> {

    private final List<String> originalList;

    public CustomArrayAdapter(Context context, int resource, List<String> objects) {
        super(context, resource, objects);
        this.originalList = objects;
    }
    public CustomArrayAdapter(Context context, int resource, int textViewResourceId, List<String> objects) {
        super(context, resource, textViewResourceId, objects);
        this.originalList = objects;
    }

    @Override
    public int getCount() {
        return originalList.size();
    }

    @Override
    public String getItem(int position) {
        return originalList.get(position);
    }
}
