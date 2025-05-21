// import { createClient } from '@supabase/supabase-js';

const {createClient} = require("@supabase/supabase-js") 

const supabaseUrl = process.env.SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);
const test = async( ) =>{
    const { data, error } = await supabase.from('memes').select('*');
    console.log(data);
    // console.log(supabaseUrl,supabaseKey);
}

module.exports = {supabase,test}