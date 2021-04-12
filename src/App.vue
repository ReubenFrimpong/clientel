<template>
  <v-app>

    <v-main>
      <v-container>
        <v-data-table
                :headers="headers"
                :items="dataSet"
                :loading ="loading"
                class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Clients</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="550px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark class="mb-2" v-bind="attrs" @click="">
                    New Client
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Add Client</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>

                        <v-col cols="12">
                          <v-text-field
                                  label="Fullname*"
                                  outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                                  label="Phone Number*"
                                  outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions class="pb-6">
                    <v-spacer></v-spacer>
                    <v-btn color="#CF202E" class="white--text"
                           :loading="loading"
                           block
                           x-large
                           @click="">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small color="error" @click="">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ClientDataService from './services/ClientDataService'
export default {
  name: 'App',

  mounted(){
    this.getAllClients()
  },

  data(){
    return{
      loading: false,
      dialog: null,
      headers:[
        {
          text: 'Name',
          value: 'name',
          sortable: true
        },
        {
          text: 'Email',
          value: 'email',
          sortable: false
        },
        {
          text: 'Phone',
          value: 'phone',
          sortable: false
        },
        {
          text: 'Providers',
          value: 'provider.name',
          sortable: false
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
      ],
      dataSet: []
    }
  },

  methods:{
    getAllClients(){
      ClientDataService.getAll().then(response=>{
        this.dataSet = response.data
      }).catch(e=>{
        console.log(e)
      })
    }
  }
};
</script>
