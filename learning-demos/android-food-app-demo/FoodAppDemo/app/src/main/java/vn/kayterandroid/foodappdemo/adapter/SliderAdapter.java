package vn.kayterandroid.foodappdemo.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.smarteist.autoimageslider.SliderViewAdapter;

import java.util.ArrayList;
import java.util.List;

import vn.kayterandroid.foodappdemo.R;
import vn.kayterandroid.foodappdemo.model.Food;

public class SliderAdapter extends SliderViewAdapter<SliderAdapter.SliderHolder> {

    private Context context;
    private ArrayList<Integer> arrayList;

    public SliderAdapter(Context context, ArrayList<Integer> arrayList) {
        this.context = context;
        this.arrayList = arrayList;
    }

    @Override
    public SliderHolder onCreateViewHolder(ViewGroup parent) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.image_slider_layout_item, parent, false);
        return new SliderHolder(view);
    }

    @Override
    public void onBindViewHolder(SliderHolder viewHolder, int position) {
        Glide.with(context)
                .load(arrayList.get(position))
                .into(viewHolder.imageItem);
    }

    @Override
    public int getCount() {
        return arrayList.size();
    }

    public class SliderHolder extends SliderViewAdapter.ViewHolder {
        ImageView imageItem;

        public SliderHolder(View itemView) {
            super(itemView);
            imageItem = itemView.findViewById(R.id.imageItem);
        }
    }
}
