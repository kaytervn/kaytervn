package vn.kayterandroid.videoshortfirebase;

import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.firebase.ui.database.FirebaseRecyclerAdapter;
import com.firebase.ui.database.FirebaseRecyclerOptions;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

public class VideosFireBaseAdapter extends FirebaseRecyclerAdapter<VideoModel, VideosFireBaseAdapter.MyHolder> {
    private boolean isFav = false;

    public VideosFireBaseAdapter(@NonNull FirebaseRecyclerOptions<VideoModel> options) {
        super(options);
    }

    public static class MyHolder extends RecyclerView.ViewHolder {
        private final VideoView videoView;
        private final ProgressBar videoProgressBar;
        private final TextView textVideoTitle;
        private final TextView textVideoDescription;
        private ImageView imPerson, favorites, imShare, imMore;

        public MyHolder(@NonNull View itemView) {
            super(itemView);
            videoView = itemView.findViewById(R.id.videoView);
            videoProgressBar = itemView.findViewById(R.id.videoProgressBar);
            textVideoTitle = itemView.findViewById(R.id.textVideoTitle);
            textVideoDescription = itemView.findViewById(R.id.textVideoDescription);
            imPerson = itemView.findViewById(R.id.imPerson);
            favorites = itemView.findViewById(R.id.favorites);
            imShare = itemView.findViewById(R.id.imShare);
            imMore = itemView.findViewById(R.id.imMore);
        }
    }

    @NonNull
    @Override
    public MyHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.single_video_row, parent, false);
        return new MyHolder(view);
    }

    @Override
    protected void onBindViewHolder(@NonNull MyHolder holder, int position, @NonNull VideoModel model) {
        holder.textVideoTitle.setText(model.getTitle());
        holder.textVideoDescription.setText(model.getDesc());
        String videoUrl = model.getUrl();
        FirebaseStorage storage = FirebaseStorage.getInstance();
        StorageReference videoRef = storage.getReferenceFromUrl(videoUrl);
        videoRef.getDownloadUrl().addOnSuccessListener(uri -> {
            holder.videoView.setVideoURI(uri);
            holder.videoView.setOnPreparedListener(mp -> {
                holder.videoProgressBar.setVisibility(View.GONE);
                mp.start();
                if (mp != null) {
                    float videoRatio = mp.getVideoWidth() / (float) mp.getVideoHeight();
                    float screenRatio = holder.videoView.getHeight() != 0 ? holder.videoView.getWidth() / (float) holder.videoView.getHeight() : 1;
                    float scale = videoRatio / screenRatio;
                    if (scale >= 1f) {
                        holder.videoView.setScaleX(scale);
                    } else {
                        holder.videoView.setScaleY(1f / scale);
                    }
                }
            });
            holder.videoView.setOnCompletionListener(mp -> {
                if (mp != null && mp.isLooping()) {
                    mp.start();
                }
            });
        });

        holder.favorites.setOnClickListener(v -> {
            if (!isFav) {
                holder.favorites.setImageResource(R.drawable.baseline_favorite_24);
                isFav = true;
            } else {
                holder.favorites.setImageResource(R.drawable.baseline_favorite_border_24);
                isFav = false;
            }
        });
    }
}