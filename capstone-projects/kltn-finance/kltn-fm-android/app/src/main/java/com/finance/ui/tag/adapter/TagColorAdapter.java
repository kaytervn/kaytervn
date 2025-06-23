package com.finance.ui.tag.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Filter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.finance.R;
import com.finance.data.model.api.response.tag.TagResponse;

import java.util.ArrayList;
import java.util.List;
import timber.log.Timber;

public class TagColorAdapter extends ArrayAdapter<TagResponse> {
    private final List<TagResponse> mListTags;
    private final List<TagResponse> mListOriginTags;
    private final LayoutInflater inflater;

    public TagColorAdapter(@NonNull Context context, @NonNull List<TagResponse> tags) {
        super(context, 0, tags);
        this.inflater = LayoutInflater.from(context);
        mListTags = tags;
        mListOriginTags = new ArrayList<>(mListTags);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {

        if (convertView == null) {
            convertView = inflater.inflate(R.layout.layout_drop_down_color, parent, false);
        }
        TagResponse tag = getItem(position);
        TextView tv = convertView.findViewById(R.id.tv_drop_down_item);
        ImageView imgView = convertView.findViewById(R.id.layout_color_square);
        try{
            if (tag != null) {
                tv.setText(tag.getName());
                imgView.setColorFilter(Color.parseColor(tag.getColorCode()));
            }
        } catch (Exception e){
            Timber.tag("TagColorAdapter").e("getView: %s", e.getMessage());
        }

        return convertView;
    }

    @NonNull
    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                FilterResults results = new FilterResults();
                List<TagResponse> filteredTags = new ArrayList<>();

                Timber.tag("TagFilter").e("listag: %s", mListTags.toString());
                if (constraint == null || constraint.length() == 0) {
                    // If no search input, show the complete list
                    filteredTags.addAll(mListOriginTags);
                } else {
                    String query = constraint.toString().toLowerCase().trim();
                    for (TagResponse tag : mListOriginTags) {
                        if (tag.getName().toLowerCase().contains(query)) {
                            filteredTags.add(tag);
                        }
                    }

                }
                Timber.tag("TagFilterResult").e("performFiltering: %s", filteredTags.toString());
                results.values = filteredTags;
                results.count = filteredTags.size();
                return results;
            }

            @SuppressWarnings("unchecked")
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                clear();
                if (results.values != null) {
                    // Update the adapter with the filtered results
                    addAll((List<TagResponse>) results.values);
                }
                notifyDataSetChanged();
            }

            @Override
            public CharSequence convertResultToString(Object resultValue) {
                // Ensure the selected item displays its name in the AutoCompleteTextView
                return ((TagResponse) resultValue).getName();
            }
        };
    }
}
