import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';


Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#2D8CFF",
                bg_color: '#f4f4f4',
                table_header: "#869CF4",
                table_header2: '#E5E7EF',
                secondary: "#50AB26",
                background: "#f6f7fa",
                field_color: "#194E76",
                success: "#27AE60",
                error: "#D7443E",
                warning: "#F18324",
            }
        }
    }
});
