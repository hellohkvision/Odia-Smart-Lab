package com.odiasmartlab.app;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.StateListDrawable;
import android.view.Gravity;
import android.widget.Button;

/** Shared compact icon treatment for the PDF and notes toolbars. */
public final class ReaderToolbar {
    private ReaderToolbar() {}
    private static int dp(Context c, float value) { return Math.round(value * c.getResources().getDisplayMetrics().density); }
    public static GradientDrawable surface(Context c, int color, int radius) {
        GradientDrawable shape = new GradientDrawable(); shape.setColor(color);
        shape.setCornerRadius(dp(c, radius)); shape.setStroke(dp(c, 1), Color.rgb(221, 226, 223));
        return shape;
    }
    public static void apply(Button button, String icon, String description) {
        Context context = button.getContext();
        button.setText(""); button.setTextSize(0); button.setIncludeFontPadding(false);
        button.setGravity(Gravity.CENTER); button.setCompoundDrawablePadding(0);
        button.setAllCaps(false); button.setPadding(0,0,0,0);
        button.setMinWidth(dp(context,48)); button.setMinimumWidth(dp(context,48));
        button.setMinHeight(dp(context,48)); button.setMinimumHeight(dp(context,48));
        button.setElevation(0); button.setContentDescription(description);
        StateListDrawable background = new StateListDrawable();
        background.addState(new int[]{android.R.attr.state_selected}, surface(context, Color.rgb(0, 83, 51), 10));
        background.addState(new int[]{android.R.attr.state_pressed}, surface(context, Color.rgb(230, 239, 233), 10));
        background.addState(new int[]{}, surface(context, Color.WHITE, 10));
        button.setBackground(background);
        button.setCompoundDrawablesWithIntrinsicBounds(null, new Icon(context, icon), null, null);
    }
    private static final class Icon extends Drawable {
        private final int size; private final String name;
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Icon(Context c, String name) { this.name=name; size=dp(c,23); }
        @Override public int getIntrinsicWidth(){return size;}
        @Override public int getIntrinsicHeight(){return size;}
        @Override public boolean isStateful(){return true;}
        @Override protected boolean onStateChange(int[] state){invalidateSelf();return true;}
        @Override public void draw(Canvas canvas) {
            boolean enabled=false,selected=false;
            for(int state:getState()){if(state==android.R.attr.state_enabled)enabled=true;if(state==android.R.attr.state_selected)selected=true;}
            paint.reset();paint.setAntiAlias(true);paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeWidth(2.1f);paint.setStrokeCap(Paint.Cap.ROUND);paint.setStrokeJoin(Paint.Join.ROUND);
            paint.setColor(!enabled?Color.rgb(180,187,183):selected?Color.WHITE:Color.rgb(9,78,46));
            int saved=canvas.save();canvas.translate(getBounds().left,getBounds().top);canvas.scale(getBounds().width()/24f,getBounds().height()/24f);
            Path p=new Path();
            switch(name){
                case "pen": p.moveTo(3,21);p.lineTo(4.5f,16);p.lineTo(16.3f,4.2f);p.quadTo(17.6f,2.9f,19,4.3f);p.lineTo(20,5.3f);p.quadTo(21.3f,6.7f,20,8);p.lineTo(8,20);p.close();p.moveTo(14.5f,6);p.lineTo(18,9.5f);break;
                case "eraser": p.moveTo(3.7f,14.6f);p.lineTo(12.8f,5.5f);p.quadTo(14,4.3f,15.3f,5.5f);p.lineTo(20,10.2f);p.quadTo(21.2f,11.4f,20,12.6f);p.lineTo(13,19.6f);p.lineTo(8.3f,19.6f);p.close();p.moveTo(8,10.5f);p.lineTo(16,18.5f);p.moveTo(13,20);p.lineTo(21,20);break;
                case "undo": p.moveTo(9,5);p.lineTo(4,10);p.lineTo(9,15);p.moveTo(4,10);p.lineTo(14,10);p.cubicTo(21,10,21,19,14,19);break;
                case "redo": p.moveTo(15,5);p.lineTo(20,10);p.lineTo(15,15);p.moveTo(20,10);p.lineTo(10,10);p.cubicTo(3,10,3,19,10,19);break;
                case "clear": p.moveTo(4,6);p.lineTo(20,6);p.moveTo(9,6);p.lineTo(10,3);p.lineTo(14,3);p.lineTo(15,6);p.moveTo(6,6);p.lineTo(7,20);p.lineTo(17,20);p.lineTo(18,6);p.moveTo(10,10);p.lineTo(10,17);p.moveTo(14,10);p.lineTo(14,17);break;
                case "back": p.moveTo(13,5);p.lineTo(6,12);p.lineTo(13,19);p.moveTo(6,12);p.lineTo(20,12);break;
                case "previous": p.moveTo(15,5);p.lineTo(8,12);p.lineTo(15,19);break;
                case "next": p.moveTo(9,5);p.lineTo(16,12);p.lineTo(9,19);break;
                case "pages": p.moveTo(5,5);p.lineTo(15,5);p.lineTo(15,19);p.lineTo(5,19);p.close();p.moveTo(9,2);p.lineTo(19,2);p.lineTo(19,16);break;
                case "more": canvas.drawCircle(5,12,1.5f,paint);canvas.drawCircle(12,12,1.5f,paint);canvas.drawCircle(19,12,1.5f,paint);break;
            }
            canvas.drawPath(p,paint);canvas.restoreToCount(saved);
        }
        @Override public void setAlpha(int alpha){}
        @Override public void setColorFilter(ColorFilter filter){}
        @Override public int getOpacity(){return PixelFormat.TRANSLUCENT;}
    }
}
